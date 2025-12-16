import {toast} from "react-hot-toast"
import { apiConnector } from '../apiconnector';
import { catalogData } from '../api';

export const getCatalogaPageData = async(categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try{
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, 
        {categoryId: categoryId,});

        if(!response?.data?.success)
            throw new Error("Could not Fetch Category page data");

        // Check if no courses available and show appropriate message
        if (response?.data?.data?.selectedCategory?.courses?.length === 0) {
          toast.success("Courses are currently not available for this category");
        }
        
        result = response?.data;

  }
  catch(error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);
    toast.error("Courses are currently not available for this category");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
}