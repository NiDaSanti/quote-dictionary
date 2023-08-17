// export const AIRTABLE_API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY
// export const AIRTABLE_BASEID = process.env.REACT_APP_AIRTABLE_BASEID
// export const AIRTABLE_TABLENAME = process.env.REACT_APP_AIRTABLE_TABLENAME

// async function sendRequest(url, options) {
//   try {
//     const response = await fetch(url, options)
//     if(!response.ok) throw new Error(`Request failed with status ${response.status}`)
//     const data = await response.json()
//     return data
//   } catch(error) {
//     console.error(`Api request failed ${error}`)
//     throw error
//   }
// }

// export async function getClients() {
//   const url = `https://api.airtable.com/v0/${AIRTABLE_BASEID}/${AIRTABLE_TABLENAME}`
//   const options = {
//     method: 'GET', 
//     headers: {
//       Authorization: `Bearer ${AIRTABLE_API_KEY}`,
//       'Content-Type': 'application/json',
//     },
//   }
//   return sendRequest(url, options)
// }

// export async function createRecord(recordData) {
//   const url = `https://api.airtable.com/v0/${AIRTABLE_BASEID}/${AIRTABLE_TABLENAME}`;
//   const options = {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${AIRTABLE_API_KEY}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(recordData),
//   };
//   return sendRequest(url, options);
// }

// export async function updateRecord(recordId, recordData) {
//   const url = `https://api.airtable.com/v0/${AIRTABLE_BASEID}/${AIRTABLE_TABLENAME}/${recordId}`;
//   const options = {
//     method: 'PATCH',
//     headers: {
//       Authorization: `Bearer ${AIRTABLE_API_KEY}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(recordData),
//   };
//   return sendRequest(url, options);
// }

// export async function deleteRecord(recordId) {
//   const url = `https://api.airtable.com/v0/${AIRTABLE_BASEID}/${AIRTABLE_TABLENAME}/${recordId}`;
//   const options = {
//     method: 'DELETE',
//     headers: {
//       Authorization: `Bearer ${AIRTABLE_API_KEY}`,
//     },
//   };
//   return sendRequest(url, options);
// }