"use client"

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';


declare const Stripe: any;
declare var elements: any;
declare var stripe: any;
declare var startloading: any;
declare var stoploading: any;

interface VehicleDetailsParams {
  id: string;
  startDate?: string;
  endDate?: string;
  pickupTime?: string;
  dropTime?: string;
  pricePerHour?: string;

}

export default function SingleVehicleDetails() {

  const [vehicleImage, setVehicleImage] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [sd, setSd] = useState("");
  const [ed, setEd] = useState("");
  const [elementFetched, setElementFetched] = useState(false);
  const [paybuttontext, setPaybuttonText] = useState("Continue to Payment");

  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);



  const [params, setParams] = useState<any>({
    id: '',
    startDate: '',
    endDate: '',
    pickupTime: '',
    dropTime: '',
    pricePerHour: '',
  });

  useEffect(() => {

    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    const queryParams = window.location.search.slice(1).split('?');
    const startDate = queryParams[0];
    const endDate = queryParams[1];
    const pickupTime = queryParams[2];
    const dropTime = queryParams[3];
    const pricePerHour = queryParams[4];

    setParams({ id, startDate, endDate, pickupTime, dropTime, pricePerHour });
    fetchVehicleMetaData();
    fetchPricing();
    setElementFetched(true);
  }, []);


  function fetchVehicleMetaData() {

    var input = (JSON.parse(localStorage.getItem("checkOutInfo") as any));

    setVehicleName(input.name);
    setVehicleImage(input.image);

    setSd(input.startDate);
    setEd(input.endDate);



  }

  const submit = async () => {

    setIsPaymentProcessing(true);
    setPaybuttonText("Processing Payment");
    // startloading();
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/trips",
        receipt_email: localStorage.getItem("session_user"),

      },
      redirect: "if_required",
    });
    if (error) {
      console.error(error);
      handleError();
      setPaybuttonText("Continue to Payment");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      console.log("Payment succeeded");
      handleSuccess();
    } else {
      console.log("Payment failed");
      setPaybuttonText("Continue to Payment");
    }
    console.log(error);
  }
  const handleError = () => {
    // stoploading()
    setIsPaymentProcessing(false);

  }
  const handleSuccess = async () => {
    createReservation(localStorage.getItem("auth_token_login"))
  }



  const createReservation = (bundeeToken: string) => {

    var infoObj: any = JSON.parse(localStorage.getItem("checkOutInfo") as any);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("bundee_auth_token", bundeeToken);
    let endPoint: string = "/api/v1/booking/createReservation";
    let st_date: Date = new Date(infoObj.startDate);
    let en_date: Date = new Date(infoObj.endDate);
    let startDate: string = `${st_date.getFullYear()}-${st_date.getMonth() > 8 ? (st_date.getMonth() + 1) : ('0' + (st_date.getMonth() + 1))}-${st_date.getDate() > 9 ? st_date.getDate() : ('0' + st_date.getDate())}`;
    let endDate: string = `${en_date.getFullYear()}-${en_date.getMonth() > 8 ? (en_date.getMonth() + 1) : ('0' + (en_date.getMonth() + 1))}-${en_date.getDate() > 9 ? en_date.getDate() : ('0' + en_date.getDate())}`;
    let starttime: string = `${st_date.getHours() > 9 ? st_date.getHours() : ('0' + st_date.getHours())}:${st_date.getMinutes() > 9 ? st_date.getMinutes() : ('0' + st_date.getMinutes())}:00`;
    let endtime: string = `${en_date.getHours() > 9 ? en_date.getHours() : ('0' + en_date.getHours())}:${en_date.getMinutes() > 9 ? en_date.getMinutes() : ('0' + en_date.getMinutes())}:00`;
    let num: number = en_date.valueOf() - st_date.valueOf();
    num = num / (24 * 60 * 60 * 1000);

    let days: number = Number(("" + num).split('.')[0]) + 1;


    const requestBody = {
      "vehicleid": "" + infoObj.vehicleId,
      "userId": "" + localStorage.getItem("userId"),
      "startTime": sd,
      "endTime": ed,
      "channelName": "Bundee",
      "deductionfrequencyconfigid": 1,
      "paymentauthorizationconfigid": 1,
      "authorizationamount": params.authorizationamount,
      "authorizationpercentage": 20,
      "perDayAmount": params.perDayAmount,
      "totalDays": "" + params.totalDays,
      "stripePaymentToken": params.stripePaymentToken,
      "stripePaymentID": "NA",
      "stripePaymentTransactionDetail": "{ \"key1\" : \"val1\" }",
      "paymentMethodIDToken": "NA",
      "customerToken": params.customerToken,
      "setupIntentToken": "NA",
      "isCustomerTokenNew": "NA",
      "comments": "Request to book",
      "taxAmount": params.taxAmount,
      "tripTaxAmount": params.tripTaxAmount,
      "totalamount": params.totalamount,
      "tripamount": "" + params.tripamount,
      "pickupTime": "" + starttime,
      "dropTime": "" + endtime
    };

    var raw = JSON.stringify(requestBody);

    console.log(raw);

    fetch("https://bundeeapi2.azurewebsites.net" + endPoint, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result.errorCode);
        if (result.errorCode == '0') {
          location.href = "/checkout/success"
        } else {
          location.href = "/checkout/failure"
        }
      })
      .catch((error) => {
        console.log('error', error);
      });

  }
  const fetchPricing = async () => {

    var input = (JSON.parse(localStorage.getItem("checkOutInfo") as any))
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "email": localStorage.getItem("session_user"),
      "startDate": input.startDate,
      "endDate": input.endDate,
      "perDayAmount": input.price,
      "password": "535dff60664c8a624e056fb739e41e623b906daf3a59840f03613bbec19b6eb3"
    });

    fetch("https://bundeechatapi.azurewebsites.net/createIntent", {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    })
      .then(response => response.json())
      .then(async (result) => {
        setParams(result.response);
        const { clientSecret } = result.response.stripePaymentToken;
        const appearance = {
          theme: 'stripe',
        };
        stripe = Stripe('pk_test_51Nic7WAHBUVqiOLM8iq27Panp1plb9MLTiNSI7LVCXyMTfqFT5v0Xvgw61WKc71ShUVXz09HduhqMeMWHlcwylh700sDTMgYm2')
        elements = stripe.elements({
          clientSecret: result.response.stripePaymentToken,
        });
        const paymentElementOptions = {
          layout: "tabs",
        };
        console.log(stripe, elements);
        const paymentElement = elements.create("payment", paymentElementOptions);
        paymentElement.mount("#payment-element");

        // localStorage.setItem("passets", JSON.stringify([{...stripe},{...elements}]));
      })
      .catch(error => console.log('error', error));
  }
  return (
    <>
     
      <script src="https://js.stripe.com/v3/"></script>
      <script src='/stripeDetails.js'></script>


      {elementFetched  && (

        <div className="flex h-[650px] sm-flex-col mx-auto max-w-2xl lg:max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
              <img className="rounded-t-lg" src={vehicleImage} alt="" />
            </a>
            <div className="p-5">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{vehicleName}</h5>
              <div className="flex justify-between">
                <label className="font-bold">Trip Start Date</label>
                <p className="text-base text-gray-600">{sd}</p>
              </div>
              <div className="flex justify-between">
                <label className="font-bold">Trip End Date</label>
                <p className="text-base text-gray-600">{ed}</p>
              </div>


              <div className="paddings mt-4">
                <div className="flex justify-between">
                  <span>Total trip duration:</span>
                  <span>{params.totalDays} Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Trip amount:</span>
                  <span>{params.totalDays} Days * ${params.perDayAmount} = ${params.tripamount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax amount:</span>
                  <span>8.25% of ${params.tripamount} = ${params.taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total amount:</span>
                  <span>${params.tripTaxAmount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col container">
            <div className="p-4 bg-white shadow-md rounded-sm" id="payment-element">
            </div>
            <Button className='mt-4' onClick={submit}>{paybuttontext}</Button>
          </div>
        </div>
      )}

    </>
  );
}
