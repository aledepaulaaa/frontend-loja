import React from 'react'
import axios from 'axios'

const urlDevelopment = process.env.DEV_URL_PAYMENT
const urlProduction = process.env.NEXT_PUBLIC_PRODUCTION_URL_PAYMENT

export default function usePaymentVivaWallet() {
    const [error, setError] = React.useState(null)
    const [paymentData, setPaymentData] = React.useState(null)

    // Função para gerar o token no servidor e gerar o pagamento
    const useVivaPayment = async (paymentData) => {
        try {
            const payment = await axios.post(urlProduction, paymentData)
            const response = payment.data
            setPaymentData(response)

            console.log("Resposta do backend: ", response.data)
            // Redirecionar o usuário para o checkout da Viva Wallet
            if (response.orderCode) {
                window.location.href = `https://demo.vivapayments.com/web/checkout?ref=${response.orderCode}`;
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

