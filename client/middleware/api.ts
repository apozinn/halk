const public_api_url = process.env.EXPO_PUBLIC_API_URL;

const POST_PARAMS = {
  method: "POST",
  headers: {
    "Content-type": "application/json",
  },
};

export async function SignUp(username: string, password: string) {
  return fetch(`${public_api_url}/auth/signUp`, {
    ...POST_PARAMS,
    body: JSON.stringify({username, password}),
  })
    .then((res) => res.json())
    .then((res) => res);
}

export async function SignIn(username:string, password:string) {
  const c = fetch(`${public_api_url}/auth/signIn`, {
    ...POST_PARAMS,
    body: JSON.stringify({username, password}),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => res);
    return c;
}


export const uploadImage = async (image: any) => {
  return await fetch(`${public_api_url}/user/uploadAvatar`, {
    method: 'POST',
    body: image,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export const sendSms = async (phone: any) => {
  return fetch(`${public_api_url}/register/sendSms`, {
    ...POST_PARAMS,
    body: JSON.stringify({ phone: phone }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const verifyCode = async (id: string, code: string) => {
  return fetch(`${public_api_url}/register/verifyCode`, {
    ...POST_PARAMS,
    body: JSON.stringify({ id: id, code: code }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const verifyUsername = async (username: string) => {
  return fetch(`${public_api_url}/user/verifyUsername`, {
    ...POST_PARAMS,
    body: JSON.stringify({ username: username }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const createProfile = async (profile: any) => {
  return fetch(`${public_api_url}/auth/createProfile`, {
    ...POST_PARAMS,
    body: JSON.stringify({ ...profile }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const searchUser = async (search: string) => {
  return fetch(`${public_api_url}/user/searchUser`, {
    ...POST_PARAMS,
    body: JSON.stringify({ search: search }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const getStatus = async(userId: string) => {
  return fetch(`${public_api_url}/status/getStatus/${userId}`)
    .then((res) => res.json())
    .then((res) => res);
};

export const postStatus = async (user: { id: string; phone: string; profile: { name: string; username: string; avatar: string; bio: string; }; }, status: { id: string; createdAt: number; type: string; content: string; color: string; }) => {
  return fetch(`${public_api_url}/status/postStatus`, {
    ...POST_PARAMS,
    body: JSON.stringify({ user, status }),
  })
    .then((res) => res.json())
    .then((res) => res);
};