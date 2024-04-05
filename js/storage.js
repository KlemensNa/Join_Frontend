// const STORAGE_TOKEN = "ISAI9QDR5MFJLJDA0HK4U4QK3WHMMDT89LA45TS6";
const STORAGE_URL = "http://127.0.0.1:8000/";

async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json())
    
}

async function getItem(key) {
  // const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  // return fetch(url)
  //   .then((res) => res.json())
  //   .then((res) => {
  //     console.warn(res.data)
  //     // Verbesserter code
  //     if (res.data) {
  //       return res.data.value;
  //     }
  //     throw `Could not find data with key "${key}".`;
  //   });
}

//1WFL667576C47A9ZMOQ1CW3ATOK88WC8RT8II2Y1
//ISAI9QDR5MFJLJDA0HK4U4QK3WHMMDT89LA45TS6
