import ImgurClient from "imgur";
const api_link = "http://localhost:3000";

const POST_PARAMS = {
  method: "POST",
  headers: {
    "Content-type": "application/json",
  },
};

export const uploadImage = async (image: any) => {
  const clientId = process.env.IMGUR_ID;
  const clientSecret = process.env.IMGUR_SECRET;

  function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  var blobToBase64 = function (blob, callback) {
    var reader = new FileReader();
    reader.onload = function () {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(",")[1];
      callback(base64);
    };
    reader.readAsDataURL(blob);
  };

  return "https://i.imgur.com/Gaor20G.jpeg";
};

export const sendSms = async (phone) => {
  return fetch(`${api_link}/register/sendSms`, {
    ...POST_PARAMS,
    body: JSON.stringify({ phone: phone }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const verifyCode = async (id, code) => {
  return fetch(`${api_link}/register/verifyCode`, {
    ...POST_PARAMS,
    body: JSON.stringify({ id: id, code: code }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const verifyUsername = async (username) => {
  return fetch(`${api_link}/user/verifyUsername`, {
    ...POST_PARAMS,
    body: JSON.stringify({ username: username }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const createProfile = async (user) => {
  if(user.profile.avatar) {
    const uploadAvatar = await uploadImage(user.profile.avatar);
    user.profile.avatar = uploadAvatar;
  };

  return fetch(`${api_link}/register/createUser`, {
    ...POST_PARAMS,
    body: JSON.stringify({ user: user }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const searchUser = async (search) => {
  return fetch(`${api_link}/user/searchUser`, {
    ...POST_PARAMS,
    body: JSON.stringify({ search: search }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const getStatus = async(userId) => {
  return fetch(`${api_link}/status/getStatus/${userId}`)
    .then((res) => res.json())
    .then((res) => res);
};