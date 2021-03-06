#!/usr/bin/env python

import sys, os, time, atexit
import psutil
if sys.platform != 'win32':
    from signal import SIGKILL, SIGTERM
from lib.python import es_logging as log
logger = log.my_logger("lib.python.daemon")
from config import es_constants

if not os.path.isdir(es_constants.pid_file_dir):
        os.makedirs(es_constants.pid_file_dir)
if not os.path.isdir(es_constants.processed_list_base_dir):
        os.makedirs(es_constants.processed_list_base_dir)
if not os.path.isdir(es_constants.processed_list_eum_dir):
        os.makedirs(es_constants.processed_list_eum_dir)
if not os.path.isdir(es_constants.processed_list_int_dir):
        os.makedirs(es_constants.processed_list_int_dir)


class Daemon(object):
    """
    A generic daemon class.

    Usage: subclass the Daemon class and override the run() method
    """
    def __init__(self, pidfile, stdin='/dev/null', stdout='/dev/null', stderr='/dev/null'):
        self.stdin = stdin
        self.stdout = stdout
        self.stderr = stderr
        self.pidfile = pidfile

    def daemonize(self):
        """
        do the UNIX double-fork magic, see Stevens' "Advanced
        Programming in the UNIX Environment" for details (ISBN 0201563177)
        http://www.erlenstar.demon.co.uk/unix/faq_2.html#SEC16
        """
        try:
            pid = os.fork()
            if pid > 0:
                # exit first parent
                sys.exit(0)
        except OSError, e:
            sys.stderr.write("fork #1 failed: %d (%s)\n" % (e.errno, e.strerror))
            sys.exit(1)

        # decouple from parent environment
        os.chdir("/")
        os.setsid()
        os.umask(0000)

        # do second fork
        try:
            pid = os.fork()
            if pid > 0:
                # exit from second parent
                sys.exit(0)
        except OSError, e:
            sys.stderr.write("fork #2 failed: %d (%s)\n" % (e.errno, e.strerror))
            sys.exit(1)

        # Now I am a daemon!
        logger.debug("Daemon created")


        if(isinstance(sys.stdout, file)):
            # redirect standard file descriptors
            sys.stdout.flush()
            sys.stderr.flush()
            si = file(self.stdin, 'r')
            so = file(self.stdout, 'a+')
            se = file(self.stderr, 'a+', 0)
            os.dup2(si.fileno(), sys.stdin.fileno())
            os.dup2(so.fileno(), sys.stdout.fileno())
            os.dup2(se.fileno(), sys.stderr.fileno())
            logger.debug("Inputs and Outputs redirected")
        else:
            logger.debug("Inputs and Outputs not redirected")

        # write pidfile
        atexit.register(self.delpid)
        pid = str(os.getpid())
        file(self.pidfile, 'w+').write("%s\n" % pid)
        logger.debug("Pid %s written into file %s" % (pid,self.pidfile))

    def delpid(self):
        # Change to deal with forking in processing (otherwise the pidfile is deleted by child process)
        logger = log.my_logger("lib.python.daemon")
        #my_pid=os.getpgid
        #logger.info("My Pid: %i" % my_pid)

        #pid_file=open(self.pidfile)
        #pid = pid_file.read()
        #logger.info("Pid: %i" % pid)
        #if pid == my_pid:
        logger.info("Removing the Pid")
        os.remove(self.pidfile)

    def status(self):
        #If : pid exists + process run -> ON - return True
        #if : pid exists but process not run -> OFF - warning (and remove pid with ERROR message)
        #if: no pid -> check process (later on -> on production machine)
        pid = self.getpid_from_file()
        if pid and psutil.pid_exists(pid):
            return True
        return False

    def start(self):
        """
        Start the daemon
        """
        pid = self.getpid_from_file()

        if pid:
            if psutil.pid_exists(pid):
                message = "pidfile %s already exist and process running. Daemon already running?\n"
                sys.stderr.write(message % self.pidfile)
                sys.exit(1)
            else:
                self.delpid()
        # Start the daemon
        self.daemonize()
        self.run()

    def stop(self):
        """
        Stop the daemon
        """
        pid = self.getpid_from_file()

        if pid is None:
            message = "pidfile %s does not exist. Daemon not running?\n"
            sys.stderr.write(message % self.pidfile)
            return  # not an error in a restart

        # Try killing the daemon process
        try:
            while 1:
                #os.kill(pid, SIGTERM)
                if sys.platform != 'win32':
                    os.kill(pid, SIGKILL)
                time.sleep(0.1)
        except OSError, err:
            err = str(err)
            if err.find("No such process") > 0:
                if os.path.exists(self.pidfile):
                    os.remove(self.pidfile)
            else:
                print str(err)
                sys.exit(1)

    def restart(self):
        """
        Restart the daemon
        """
        self.stop()
        self.start()

    def run(self):
        """
        You should override this method when you subclass Daemon. It will be called after the process has been
        daemonized by start() or restart().
        """
        Exception("You should override me!")

    def getpid_from_file(self):
        """
        Read PID from filename
        """
        # Get the pid from the pidfile
        try:
            pf = file(self.pidfile,'r')
            pid = int(pf.read().strip())
            pf.close()
        except:
            pid = None
        return pid


#  Moved here as it is used by acquisition.py and processing.py
class DaemonDryRunnable(Daemon):
    def __init__(self, *args, **kwargs):
        self.dry_run = kwargs.pop('dry_run', True)
        super(DaemonDryRunnable, self).__init__(*args, **kwargs)
        #Daemon.__init__(self, *args, **kwargs)
