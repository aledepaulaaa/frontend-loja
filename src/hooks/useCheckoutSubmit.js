import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "react-use-cart";
import useRazorpay from "react-razorpay";

//internal import
import useAsync from "./useAsync";
import { getUserSession } from "@lib/auth";
import { UserContext } from "@context/UserContext";
import OrderServices from "@services/OrderServices";
import CouponServices from "@services/CouponServices";
import { notifyError, notifySuccess } from "@utils/toast";
import CustomerServices from "@services/CustomerServices";
import NotificationServices from "@services/NotificationServices";
import usePaymentVivaWallet from "./vivawallet/useVivaPayment";

const useCheckoutSubmit = (storeSetting) => {
  const { dispatch } = useContext(UserContext);

  const [error, setError] = useState("");
  const [total, setTotal] = useState("");
  const [couponInfo, setCouponInfo] = useState({});
  const [minimumAmount, setMinimumAmount] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [isCouponAvailable, setIsCouponAvailable] = useState(false);
  const [lojaSelecionada, setLojaSelecionada] = useState("");

  const router = useRouter();
  const couponRef = useRef("");
  const [Razorpay] = useRazorpay();
  const { isEmpty, emptyCart, items, cartTotal } = useCart();

  const { useVivaPayment } = usePaymentVivaWallet();

  const userInfo = getUserSession();

  const { data, loading } = useAsync(() =>
    CustomerServices.getShippingAddress({
      userId: userInfo?.id,
    })
  );

  const hasShippingAddress =
    !loading &&
    data?.shippingAddress &&
    Object.keys(data?.shippingAddress)?.length > 0;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (Cookies.get("couponInfo")) {
      const coupon = JSON.parse(Cookies.get("couponInfo"));
      // console.log('coupon information',coupon)
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountType);
      setMinimumAmount(coupon.minimumAmount);
    }
    setValue("email", userInfo?.email);
  }, [isCouponApplied]);

  //remove coupon if total value less then minimum amount of coupon
  useEffect(() => {
    if (minimumAmount - discountAmount > total || isEmpty) {
      setDiscountPercentage(0);
      Cookies.remove("couponInfo");
    }
  }, [minimumAmount, total]);

  //calculate total and discount value
  useEffect(() => {
    const discountProductTotal = items?.reduce(
      (preValue, currentValue) => preValue + currentValue.itemTotal, 0);

    let totalValue = 0;
    const subTotal = parseFloat(cartTotal + Number(shippingCost));
    const discountAmount = discountPercentage?.type === "fixed"
      ? discountPercentage?.value
      : discountProductTotal * (discountPercentage?.value / 100);

    const discountAmountTotal = discountAmount ? discountAmount : 0;
    totalValue = Number(subTotal) - discountAmountTotal;

    setDiscountAmount(discountAmountTotal);
    // console.log("total", totalValue);

    setTotal(totalValue);
  }, [cartTotal, shippingCost, discountPercentage]);

  // Converte o valor total para centavos
  const totalPrice = Math.round(total * 100)
 
  const submitHandler = async (data) => {
    console.log('Submit chamado');

    try {
      setIsCheckoutSubmit(true);
      setError("");

      const userDetails = {
        name: `${data.firstName} ${data.lastName}`,
        contact: data.contact,
        email: data.email,
        address: data.address,
        country: data.country,
        city: data.city,
        zipCode: data.zipCode,
      };

      let orderInfo = {
        user_info: userDetails,
        shippingOption: data.shippingOption,
        paymentMethod: data.paymentMethod,
        status: "Pending",
        cart: items,
        subTotal: cartTotal,
        shippingCost: shippingCost,
        discount: discountAmount,
        total: total,
      };

      const orderPaymentData = {
        "amount": totalPrice,
        "customerTrns": `Loja: ${lojaSelecionada}`,
        "customer": {
          "email": userDetails.email,
          "fullName": userDetails.name,
          "phone": userDetails.contact,
          "countryCode": 978,
          "requestLang": "pt",
        },
        "paymentTimeout": 1800,
        "preauth": false,
        "allowRecurring": false,
        "maxInstallments": 12,
        "paymentNotification": true,
        "tipAmount": 0,
        "disableExactAmount": false,
        "disableCash": true,
        "disableWallet": true,
        "sourceCode": "Default",
      }

      await useVivaPayment(orderPaymentData);

      await CustomerServices.addShippingAddress({
        userId: userInfo?.id,
        shippingAddressData: {
          name: data.firstName + " " + data.lastName,
          contact: data.contact,
          email: userInfo?.email,
          address: data.address,
          country: data.country,
          city: data.city,
          // area: data.area,
          zipCode: data.zipCode,
        },
      });
      
      emptyCart();
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setIsCheckoutSubmit(false);
    }
  };

  const handleShippingCost = (value) => {
    // console.log("handleShippingCost", value);
    setShippingCost(Number(value));
  };

  //handle default shipping address
  const handleDefaultShippingAddress = (value) => {
    // console.log("handle default shipping", value);
    setUseExistingAddress(value);
    if (value) {
      const address = data?.shippingAddress;
      setValue("firstName", address.name);

      setValue("address", address.address);
      setValue("contact", address.contact);
      // setValue("email", address.email);
      setValue("city", address.city);
      setValue("country", address.country);
      setValue("zipCode", address.zipCode);
    } else {
      setValue("firstName");
      setValue("lastName");
      setValue("address");
      setValue("contact");
      // setValue("email");
      setValue("city");
      setValue("country");
      setValue("zipCode");
    }
  };
  const handleCouponCode = async (e) => {
    e.preventDefault();

    if (!couponRef.current.value) {
      notifyError("Please Input a Coupon Code!");
      return;
    }
    setIsCouponAvailable(true);

    try {
      const coupons = await CouponServices.getShowingCoupons();
      const result = coupons.filter(
        (coupon) => coupon.couponCode === couponRef.current.value
      );
      setIsCouponAvailable(false);

      if (result.length < 1) {
        notifyError("Please Input a Valid Coupon!");
        return;
      }

      if (dayjs().isAfter(dayjs(result[0]?.endTime))) {
        notifyError("This coupon is not valid!");
        return;
      }

      if (total < result[0]?.minimumAmount) {
        notifyError(
          `Minimum ${result[0].minimumAmount} USD required for Apply this coupon!`
        );
        return;
      } else {
        notifySuccess(
          `Your Coupon ${result[0].couponCode} is Applied on ${result[0].productType}!`
        );
        setIsCouponApplied(true);
        setMinimumAmount(result[0]?.minimumAmount);
        setDiscountPercentage(result[0].discountType);
        dispatch({ type: "SAVE_COUPON", payload: result[0] });
        Cookies.set("couponInfo", JSON.stringify(result[0]));
      }
    } catch (error) {
      return notifyError(error.message);
    }
  };

    // Buscar no localStorage a loja escolhida e atualizar com o hook
    const getStoreSelected = () => {
      const loja = localStorage.getItem("mexilhoeira" ? "mexilhoeira" : "portimao");
      if (loja === `37°09'30.3"N 8°36'51.5"W`) {
        setLojaSelecionada("Mexilhoeira");
      } else if (loja === `37°08'12.6"N 8°32'25.6"W`) {
        setLojaSelecionada("Portimão");
      }
    }
  
    useEffect(() => {
      getStoreSelected()
    }, [lojaSelecionada])

  return {
    register,
    emptyCart,
    lojaSelecionada,
    errors,
    showCard,
    setShowCard,
    error,
    couponInfo,
    couponRef,
    total,
    isEmpty,
    items,
    cartTotal,
    handleSubmit,
    submitHandler,
    handleShippingCost,
    handleCouponCode,
    discountPercentage,
    discountAmount,
    shippingCost,
    isCheckoutSubmit,
    isCouponApplied,
    useExistingAddress,
    hasShippingAddress,
    isCouponAvailable,
    handleDefaultShippingAddress,
  };
};

export default useCheckoutSubmit;
