#
#	purpose: Define the processing chain for merging several inputs
#	author:  M.Clerici & Jurriaan van't Klooster
#	date:	 05.01.2015
#   descr:	 Generate a new 'merged-version' from 'pieces' of existing 'versions'
#	history: 1.0
#

# Import std modules
import os, sys

# Import eStation2 modules
from lib.python import es_logging as log
from config import es_constants
from apps.processing import proc_functions
from lib.python import functions
from database import querydb

#   General definitions for this processing chain
ext=es_constants.ES2_OUTFILE_EXTENSION

#   ---------------------------------------------------------------------
#   Run the pipeline
def processing_merge(pipeline_run_level=0, pipeline_printout_level=0,
                     input_products='', output_product='', mapset='', logfile=None):


    spec_logger = log.my_logger(logfile)
    spec_logger.info("Entering routine %s" % 'processing_merge')

    # Dummy return arguments
    proc_lists = functions.ProcLists()
    list_subprods = proc_lists.list_subprods
    list_subprod_groups = proc_lists.list_subprod_groups

    es2_data_dir = es_constants.processing_dir+os.path.sep

    # Do some checks on the integrity of the inputs

    # Manage output_product data
    out_product_code = output_product[0].productcode
    out_sub_product_code = output_product[0].subproductcode
    out_version = output_product[0].version
    out_mapset = output_product[0].mapsetcode

    out_subdir = functions.set_path_sub_directory(out_product_code, out_sub_product_code,'Ingest', out_version, out_mapset)
    out_prod_ident = functions.set_path_filename_no_date(out_product_code, out_sub_product_code, out_mapset, out_version, ext)
    out_dir = es2_data_dir + out_subdir

    # Check the output product directory
    functions.check_output_dir(out_dir)
    # Fill the processing list -> some fields to be taken by innput products
    output_sprod_group=proc_lists.proc_add_subprod_group("merged")
    output_sprod=proc_lists.proc_add_subprod(out_sub_product_code, "merged", final=False,
                                             descriptive_name='undefined',
                                             description='undefined',
                                             frequency_id='e1dekad',
                                             date_format='YYYYMMDD',
                                             masked=False,
                                             timeseries_role='10d',
                                             active_default=True)

    # Loop over the input products:
    for input in input_products:

        # Extract info from input product
        product_code = input.productcode
        sub_product_code = input.subproductcode
        version = input.version
        start_date = input.start_date
        end_date = input.end_date
        product_info = querydb.get_product_out_info_connect(productcode=product_code,
                                                   subproductcode=sub_product_code,
                                                   version=version)
        prod_type = product_info[0].product_type

        in_subdir = functions.set_path_sub_directory(product_code, sub_product_code, prod_type, version, out_mapset)
        in_prod_ident = functions.set_path_filename_no_date(out_product_code, out_sub_product_code, out_mapset, version, ext)

        # Create the list of dates -> returns empty if start==end==None
        list_dates = proc_functions.get_list_dates_for_dataset(product_code, sub_product_code, version,
                                                               start_date=start_date, end_date=end_date)
        # If list_dates == None, look at all existing files
        if list_dates is None:
            print 'To be Done !!!'
        # Otherwise, build list of files from list of dates
        else:
            for my_date in list_dates:
                in_file_path = es2_data_dir + in_subdir + my_date + in_prod_ident
                out_file_path = out_dir+my_date+out_prod_ident

                # Create the link
                status = functions.create_sym_link(in_file_path, out_file_path, force=False)
                if status == 0:
                    spec_logger.info("Merged file %s created" % out_file_path)

    return list_subprods, list_subprod_groups
