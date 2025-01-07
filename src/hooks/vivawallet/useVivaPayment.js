import React from 'react'
import axios from 'axios'

const vivaWalletURL = "http://localhost:5055/api/vivawalletpayment"

export default function usePaymentVivaWallet() {
    const [error, setError] = React.useState(null)
    const [paymentData, setPaymentData] = React.useState(null)

    // Função para gerar o token no servidor e gerar o pagamento
    const useVivaPayment = async (paymentData) => {
        try {
            const payment = await axios.post(vivaWalletURL, paymentData)
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

