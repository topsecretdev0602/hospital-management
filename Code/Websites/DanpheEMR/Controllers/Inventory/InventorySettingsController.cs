﻿
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DanpheEMR.Core.Configuration;
using DanpheEMR.ServerModel;
using DanpheEMR.DalLayer;
using System.Data.Entity;
using System.Data.SqlClient;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using DanpheEMR.Utilities;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Http.Features;
using DanpheEMR.CommonTypes;
using DanpheEMR.Core.Caching;
using RefactorThis.GraphDiff;//for entity-update.
using System.Collections.ObjectModel;
using DanpheEMR.ServerModel.InventoryModels;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace DanpheEMR.Controllers
{
    public class InventorySettingsController : CommonController
    {

        //private readonly string connString = null;
        public InventorySettingsController(IOptions<MyConfiguration> _config) : base(_config)
        {
            //connString = _config.Value.Connectionstring;

        }

        // GET: api/values
        [HttpGet]
        public string Get(string reqType,
            bool ShowIsActive)
        {
            DanpheHTTPResponse<object> responseData = new DanpheHTTPResponse<object>();
            InventoryDbContext inventoryDbContext = new InventoryDbContext(connString);

            try
            {
                if (reqType == "VendorsList")
                {

                    List<VendorMasterModel> vendorslist = (from vendor in inventoryDbContext.Vendors
                                                           select vendor).ToList();
                    responseData.Status = "OK";
                    responseData.Results = vendorslist;
                }
                else if (reqType == "GetInventoryTerms")
                {

                    List<InventoryTermsModel> termsconditions = (from terms in inventoryDbContext.InventoryTerms
                                                           select terms).OrderByDescending(a => a.CreatedOn).ToList();
                    responseData.Status = "OK";
                    responseData.Results = termsconditions;
                }

                else if (reqType == "GetCurrencyCodeList")
                {
                    List<CurrencyMasterModel> currlist = (from curr in inventoryDbContext.CurrencyMaster
                                                          select curr).ToList();
                    responseData.Status = "OK";
                    responseData.Results = currlist;
                }
                else if (reqType == "GetVendors")
                {
                    List<VendorMasterModel> vendorslist = (from v in inventoryDbContext.Vendors
                                                           select v).ToList();
                    responseData.Status = "OK";
                    responseData.Results = vendorslist;
                }
                else if (reqType == "GetItemCategory")
                {
                    List<ItemCategoryMasterModel> itemcategorylist = (from v in inventoryDbContext.ItemCategoryMaster
                                                                      select v).ToList();
                    responseData.Status = "OK";
                    responseData.Results = itemcategorylist;
                }
                else if (reqType == "GetItemSubCategory")
                {
                    List<ItemSubCategoryMasterModel> itemsubcategorylist = (from v in inventoryDbContext.ItemSubCategoryMaster
                                                                      select v).ToList();
                    responseData.Status = "OK";
                    responseData.Results = itemsubcategorylist;
                }
                else if (reqType == "GetPackagingType")
                {
                    List<PackagingTypeMasterModel> packagingtypelist = (from v in inventoryDbContext.PackagingTypeMaster
                                                                        select v).ToList();
                    responseData.Status = "OK";
                    responseData.Results = packagingtypelist;
                }
                else if (reqType == "GetAccountHead")
                {

                    //Yubraj: -- modification --2nd April 2019
                    //ShowIsActive has either true or null value
                    //ShowIsActive= true gets all the accountheadlist with IsActive true and false
                    List<AccountHeadMasterModel> accountheadlist = new List<AccountHeadMasterModel>();
                    if (ShowIsActive)
                    {
                        //getting IsActive=true list
                        accountheadlist = (from list in inventoryDbContext.AccountHeadMaster
                                           where list.IsActive == ShowIsActive
                                            select list).ToList();
                    }
                    else
                    {
                        //getting all list
                        accountheadlist = inventoryDbContext.AccountHeadMaster.ToList();
                    }
                    responseData.Status = "OK";
                    responseData.Results = accountheadlist;
                }
                else if (reqType == "GetUnitOfMeasurement")
                {
                    List<UnitOfMeasurementMasterModel> unitofmeasurementlist = (from v in inventoryDbContext.UnitOfMeasurementMaster
                                                                                select v).ToList();
                    responseData.Status = "OK";
                    responseData.Results = unitofmeasurementlist;
                }
                else if (reqType == "GetItem")
                {
                    List<ItemMasterModel> itemlist = (from v in inventoryDbContext.Items
                                                      select v).ToList();
                    responseData.Status = "OK";
                    responseData.Results = itemlist;
                }
            }
            catch (Exception ex)
            {
                string str = ex.InnerException.Message.ToString();
                responseData.Status = "Failed";
                responseData.ErrorMessage = ex.Message;
            }


            return DanpheJSONConvert.SerializeObject(responseData);

        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public string Post()
        {
            //if reqtype=employee, then use masterdbcontext.employee.add  and so on for others.

            DanpheHTTPResponse<object> responseData = new DanpheHTTPResponse<object>();//type 'object' since we have variable return types
            responseData.Status = "OK";//by default status would be OK, hence assigning at the top

            InventoryDbContext inventoryDBContext = new InventoryDbContext(connString);



            try
            {
                //string str = Request.Form.Keys.First<string>();
                string str = this.ReadPostData();
                string reqType = this.ReadQueryStringData("reqType");
                string vendorName = this.ReadQueryStringData("vendorName");
                int itemId = ToInt(this.ReadQueryStringData("itemId"));
                if (reqType == "AddVendors")
                {
                    VendorMasterModel vendorModel = DanpheJSONConvert.DeserializeObject<VendorMasterModel>(str);
                    vendorModel.CreatedOn = System.DateTime.Now;
                    inventoryDBContext.Vendors.Add(vendorModel);
                    inventoryDBContext.SaveChanges();
                    responseData.Results = vendorModel;
                    responseData.Status = "OK";
                }

                else if (reqType == "AddItemCategory")
                {
                    ItemCategoryMasterModel itemcategoryModel = DanpheJSONConvert.DeserializeObject<ItemCategoryMasterModel>(str);
                    itemcategoryModel.CreatedOn = System.DateTime.Now;
                    inventoryDBContext.ItemCategoryMaster.Add(itemcategoryModel);
                    inventoryDBContext.SaveChanges();
                    responseData.Results = itemcategoryModel;
                    responseData.Status = "OK";
                }
                else if (reqType == "AddItemSubCategory")
                {
                    ItemSubCategoryMasterModel itemsubcategoryModel = DanpheJSONConvert.DeserializeObject<ItemSubCategoryMasterModel>(str);
                    itemsubcategoryModel.CreatedOn = System.DateTime.Now;
                    inventoryDBContext.ItemSubCategoryMaster.Add(itemsubcategoryModel);
                    inventoryDBContext.SaveChanges();
                    responseData.Results = itemsubcategoryModel;
                    responseData.Status = "OK";
                }
                //posting to inventory terms & conditions 
                else if (reqType == "PostInventoryTerms")
                {
                    InventoryTermsModel termsconditions = DanpheJSONConvert.DeserializeObject<InventoryTermsModel>(str);
                    termsconditions.CreatedOn = System.DateTime.Now;
                    inventoryDBContext.InventoryTerms.Add(termsconditions);
                    inventoryDBContext.SaveChanges();
                    responseData.Results = termsconditions;
                    responseData.Status = "OK";
                }

                else if (reqType == "AddUnitOfMeasurement")
                {
                    UnitOfMeasurementMasterModel unitofmeasurementModel = DanpheJSONConvert.DeserializeObject<UnitOfMeasurementMasterModel>(str);
                    unitofmeasurementModel.CreatedOn = System.DateTime.Now;
                    inventoryDBContext.UnitOfMeasurementMaster.Add(unitofmeasurementModel);
                    inventoryDBContext.SaveChanges();
                    responseData.Results = unitofmeasurementModel;
                    responseData.Status = "OK";
                }
               else if (reqType == "AddPackagingType")
                {
                    PackagingTypeMasterModel packagingtypeModel = DanpheJSONConvert.DeserializeObject<PackagingTypeMasterModel>(str);
                    packagingtypeModel.CreatedOn = System.DateTime.Now;
                    inventoryDBContext.PackagingTypeMaster.Add(packagingtypeModel);
                    inventoryDBContext.SaveChanges();
                    responseData.Results = packagingtypeModel;
                    responseData.Status = "OK";
                }
               else if (reqType == "AddAccountHead")
                {
                    AccountHeadMasterModel accountheadModel = DanpheJSONConvert.DeserializeObject<AccountHeadMasterModel>(str);
                    accountheadModel.CreatedOn = System.DateTime.Now;
                    inventoryDBContext.AccountHeadMaster.Add(accountheadModel);
                    inventoryDBContext.SaveChanges();
                    responseData.Results = accountheadModel;
                    responseData.Status = "OK";
                }
               else if (reqType == "AddItem")
                {
                    ItemMasterModel itemModel = DanpheJSONConvert.DeserializeObject<ItemMasterModel>(str);
                    itemModel.CreatedOn = System.DateTime.Now;                    
                    inventoryDBContext.Items.Add(itemModel);
                    inventoryDBContext.SaveChanges();
                    responseData.Results = itemModel;
                    responseData.Status = "OK";
                }
               else if (reqType == "AddCurrency")
                {
                    CurrencyMasterModel currencyModel = DanpheJSONConvert.DeserializeObject<CurrencyMasterModel>(str);
                    currencyModel.CreatedOn = System.DateTime.Now;
                    inventoryDBContext.CurrencyMaster.Add(currencyModel);
                    inventoryDBContext.SaveChanges();
                    responseData.Results = currencyModel;
                    responseData.Status = "OK";
                }
            }
            catch (Exception ex)
            {
                responseData.Status = "Failed";
                responseData.ErrorMessage = ex.Message + " exception details:" + ex.ToString();

            }


            return DanpheJSONConvert.SerializeObject(responseData, true);
        }



        // PUT api/values/5
        [HttpPut]
        public string Update(/*string reqType*/)
        {

            DanpheHTTPResponse<object> responseData = new DanpheHTTPResponse<object>();

            InventoryDbContext inventoryDBContext = new InventoryDbContext(connString);


            try
            {
                //string str = Request.Form.Keys.First<string>();
                string str = this.ReadPostData();
                string reqType = this.ReadQueryStringData("reqType");
                if (!String.IsNullOrEmpty(str))
                {
                    if (reqType == "UpdateVendors")
                    {
                        VendorMasterModel vendor = DanpheJSONConvert.DeserializeObject<VendorMasterModel>(str);
                        inventoryDBContext.Vendors.Attach(vendor);
                        inventoryDBContext.Entry(vendor).State = EntityState.Modified;
                        inventoryDBContext.Entry(vendor).Property(x => x.CreatedOn).IsModified = false;
                        inventoryDBContext.Entry(vendor).Property(x => x.CreatedBy).IsModified = false;

                        inventoryDBContext.SaveChanges();
                        responseData.Results = vendor;
                        responseData.Status = "OK";
                    }
                    else if (reqType == "UpdateInventoryTerms")
                    {
                        InventoryTermsModel termsconditions = DanpheJSONConvert.DeserializeObject<InventoryTermsModel>(str);
                        inventoryDBContext.InventoryTerms.Attach(termsconditions);
                        inventoryDBContext.Entry(termsconditions).State = EntityState.Modified;
                        inventoryDBContext.Entry(termsconditions).Property(x => x.CreatedOn).IsModified = false;
                        inventoryDBContext.Entry(termsconditions).Property(x => x.CreatedBy).IsModified = false;

                        inventoryDBContext.SaveChanges();
                        responseData.Results = termsconditions;
                        responseData.Status = "OK";
                    }

                    if (reqType == "UpdateItemCategory")
                    {
                        ItemCategoryMasterModel itemcategoryModel = DanpheJSONConvert.DeserializeObject<ItemCategoryMasterModel>(str);
                        inventoryDBContext.ItemCategoryMaster.Attach(itemcategoryModel);
                        inventoryDBContext.Entry(itemcategoryModel).State = EntityState.Modified;
                        inventoryDBContext.Entry(itemcategoryModel).Property(x => x.CreatedOn).IsModified = false;
                        inventoryDBContext.Entry(itemcategoryModel).Property(x => x.CreatedBy).IsModified = false;

                        inventoryDBContext.SaveChanges();
                        responseData.Results = itemcategoryModel;
                        responseData.Status = "OK";
                    }
                    if (reqType == "UpdateItemSubCategory")
                    {
                        ItemSubCategoryMasterModel itemsubcategoryModel = DanpheJSONConvert.DeserializeObject<ItemSubCategoryMasterModel>(str);
                        inventoryDBContext.ItemSubCategoryMaster.Attach(itemsubcategoryModel);
                        inventoryDBContext.Entry(itemsubcategoryModel).State = EntityState.Modified;
                        inventoryDBContext.Entry(itemsubcategoryModel).Property(x => x.CreatedOn).IsModified = false;
                        inventoryDBContext.Entry(itemsubcategoryModel).Property(x => x.CreatedBy).IsModified = false;

                        inventoryDBContext.SaveChanges();
                        responseData.Results = itemsubcategoryModel;
                        responseData.Status = "OK";
                    }
                    if (reqType == "UpdateUnitOfMeasurement")
                    {
                        UnitOfMeasurementMasterModel unitofmeasurementModel = DanpheJSONConvert.DeserializeObject<UnitOfMeasurementMasterModel>(str);
                        inventoryDBContext.UnitOfMeasurementMaster.Attach(unitofmeasurementModel);
                        inventoryDBContext.Entry(unitofmeasurementModel).State = EntityState.Modified;
                        inventoryDBContext.Entry(unitofmeasurementModel).Property(x => x.CreatedOn).IsModified = false;
                        inventoryDBContext.Entry(unitofmeasurementModel).Property(x => x.CreatedBy).IsModified = false;

                        inventoryDBContext.SaveChanges();
                        responseData.Results = unitofmeasurementModel;
                        responseData.Status = "OK";
                    }
                    if (reqType == "UpdatePackagingType")
                    {
                        PackagingTypeMasterModel packagingtypeModel = DanpheJSONConvert.DeserializeObject<PackagingTypeMasterModel>(str);
                        inventoryDBContext.PackagingTypeMaster.Attach(packagingtypeModel);
                        inventoryDBContext.Entry(packagingtypeModel).State = EntityState.Modified;
                        inventoryDBContext.Entry(packagingtypeModel).Property(x => x.CreatedOn).IsModified = false;
                        inventoryDBContext.Entry(packagingtypeModel).Property(x => x.CreatedBy).IsModified = false;

                        inventoryDBContext.SaveChanges();
                        responseData.Results = packagingtypeModel;
                        responseData.Status = "OK";
                    }
                    if (reqType == "UpdateAccountHead")
                    {
                        AccountHeadMasterModel accountheadModel = DanpheJSONConvert.DeserializeObject<AccountHeadMasterModel>(str);
                        inventoryDBContext.AccountHeadMaster.Attach(accountheadModel);
                        inventoryDBContext.Entry(accountheadModel).State = EntityState.Modified;
                        inventoryDBContext.Entry(accountheadModel).Property(x => x.CreatedOn).IsModified = false;
                        inventoryDBContext.Entry(accountheadModel).Property(x => x.CreatedBy).IsModified = false;

                        inventoryDBContext.SaveChanges();
                        responseData.Results = accountheadModel;
                        responseData.Status = "OK";
                    }
                    if (reqType == "UpdateItem")
                    {
                        ItemMasterModel itemModel = DanpheJSONConvert.DeserializeObject<ItemMasterModel>(str);
                        inventoryDBContext.Items.Attach(itemModel);
                        inventoryDBContext.Entry(itemModel).State = EntityState.Modified;
                        inventoryDBContext.Entry(itemModel).Property(x => x.CreatedOn).IsModified = false;
                        inventoryDBContext.Entry(itemModel).Property(x => x.CreatedBy).IsModified = false;

                        inventoryDBContext.SaveChanges();
                        responseData.Results = itemModel;
                        responseData.Status = "OK";
                    }
                    if (reqType == "UpdateCurrency")
                    {
                        CurrencyMasterModel currencyModel = DanpheJSONConvert.DeserializeObject<CurrencyMasterModel>(str);
                        inventoryDBContext.CurrencyMaster.Attach(currencyModel);
                        inventoryDBContext.Entry(currencyModel).State = EntityState.Modified;
                        inventoryDBContext.Entry(currencyModel).Property(x => x.CreatedOn).IsModified = false;
                        inventoryDBContext.Entry(currencyModel).Property(x => x.CreatedBy).IsModified = false;

                        inventoryDBContext.SaveChanges();
                        responseData.Results = currencyModel;
                        responseData.Status = "OK";
                    }
                }
            }
            catch (Exception ex)
            {
                responseData.Status = "Failed";
                responseData.ErrorMessage = ex.Message + " exception details:" + ex.ToString();
            }
            return DanpheJSONConvert.SerializeObject(responseData, true);
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}

