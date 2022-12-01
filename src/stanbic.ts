import axios from "axios"

const bearerToken = 'AAIgYmIzYjM1OTk3MDJkNjQ4OGEwOGU2YWExYmU3MmY3YmK5FOOnr0Wkc31WSPEajiW5rzh3isIwB6igdvSRAIgPKd1jWqjWyUWfkcmp0PpEs4-4VM_SrfqDCv6I8pefDd9YVKpJA1FVJHsVK3SEaQcGNfzj1LUyF-nx1bpn5DR7X44'

export const initiateStkPush = async (data:any)=>{
    const {amount,number} = data
    const config = {
        headers: { Authorization: `Bearer ${bearerToken}`,"Content-Type":"application/json" }
    };
    axios.post('https://api.connect.stanbicbank.co.ke/api/sandbox/mpesa-checkout',{
        "dbsReferenceId": "1",
        "billAccountRef": "0100010598766",
        "amount": amount,
        "mobileNumber": `254${number.slice(-9)}`,
        "corporateNumber": "740757",
        "bankReferenceId": "REW21331DR5F1",
        "txnNarrative": "funda"
    },config)
    .then(data => console.log(data))
    .catch(error => console.log(error))
}