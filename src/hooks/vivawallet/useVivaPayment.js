import React from 'react'
import axios from 'axios'
import { useCart } from 'react-use-cart'

const urlDevelopment = process.env.NEXT_PUBLIC_DEV_URL_PAYMENT
const urlProduction = process.env.NEXT_PUBLIC_PRODUCTION_URL_PAYMENT

export default function usePaymentVivaWallet() {
    const [error, setError] = React.useState(null)
    const [paymentData, setPaymentData] = React.useState(null)
    const { emptyCart } = useCart()

    // Função para gerar o token no servidor e gerar o pagamento
    const useVivaPayment = async (paymentData) => {
        try {
            const payment = await axios.post(urlProduction, paymentData)

            // Limpar o carrinho se for um pagamento bem-sucedido
            if (payment.status === 200) {
                emptyCart()
            } else {
                console.log("Erro ao criar ordem de pagamento.")
            }
            // Redirecionar o usuário para o checkout da Viva Wallet
            if (payment.data.orderCode) {
                window.location.href = `https://demo.vivapayments.com/web/checkout?ref=${payment.data.orderCode}`;
            } else {
                throw new Error("Código do pedido não retornado.");
            }
        } catch (err) {
            console.info("Erro ao criar ordem de pagamento:", err)
            setError(err)
        }
    }

    return {
        error,
        useVivaPayment,
    }
}

