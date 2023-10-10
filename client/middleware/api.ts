const api_link = "http://localhost:3000";

const POST_PARAMS = {
  method: "POST",
  headers: {
    "Content-type": "application/json",
  },
};

export async function CreateAccount(username: string, password: string) {
  return fetch(`${api_link}/createAccount`, {
    ...POST_PARAMS,
    body: JSON.stringify({username, password}),
  })
    .then((res) => res.json())
    .then((res) => res);
}



export const uploadImage = async (image: any) => {
  const clientId = process.env.IMGUR_ID;
  const clientSecret = process.env.IMGUR_SECRET;

  function blobToBase64(blob: Blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  return "https://i.imgur.com/Gaor20G.jpeg";
};

export const sendSms = async (phone: any) => {
  return fetch(`${api_link}/register/sendSms`, {
    ...POST_PARAMS,
    body: JSON.stringify({ phone: phone }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const verifyCode = async (id: string, code: string) => {
  return fetch(`${api_link}/register/verifyCode`, {
    ...POST_PARAMS,
    body: JSON.stringify({ id: id, code: code }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const verifyUsername = async (username: string) => {
  return fetch(`${api_link}/user/verifyUsername`, {
    ...POST_PARAMS,
    body: JSON.stringify({ username: username }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const createProfile = async (user: { id?: string; phone?: string; profile: any; }) => {
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

export const searchUser = async (search: string) => {
  return fetch(`${api_link}/user/searchUser`, {
    ...POST_PARAMS,
    body: JSON.stringify({ search: search }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const getStatus = async(userId: string) => {
  return fetch(`${api_link}/status/getStatus/${userId}`)
    .then((res) => res.json())
    .then((res) => res);
};

export const postStatus = async (user: { id: string; phone: string; profile: { name: string; username: string; avatar: string; bio: string; }; }, status: { id: string; createdAt: number; type: string; content: string; color: string; }) => {
  return fetch(`${api_link}/status/postStatus`, {
    ...POST_PARAMS,
    body: JSON.stringify({ user, status }),
  })
    .then((res) => res.json())
    .then((res) => res);
};