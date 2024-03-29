const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const POST_PARAMS = {
  method: "POST",
  headers: {
    "Content-type": "application/json",
  },
};

export async function SignUp(username: string, password: string) {
  return fetch(`${apiUrl}/user/signUp`, {
    ...POST_PARAMS,
    body: JSON.stringify({username, password}),
  })
    .then((res) => res.json())
    .then((res) => res);
}

export async function SignIn(username:string, password:string) {
  return fetch(`${apiUrl}/user/signIn`, {
    ...POST_PARAMS,
    body: JSON.stringify({username, password}),
  })
    .then((res) => res.json())
    .then((res) => res);
}


export const uploadImage = async (image: any) => {
  return await fetch(`${apiUrl}/user/uploadAvatar`, {
    method: 'POST',
    body: image,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export const sendSms = async (phone: any) => {
  return fetch(`${apiUrl}/register/sendSms`, {
    ...POST_PARAMS,
    body: JSON.stringify({ phone: phone }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const verifyCode = async (id: string, code: string) => {
  return fetch(`${apiUrl}/register/verifyCode`, {
    ...POST_PARAMS,
    body: JSON.stringify({ id: id, code: code }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const verifyUsername = async (username: string) => {
  return fetch(`${apiUrl}/user/verifyUsername`, {
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

  return fetch(`${apiUrl}/register/createUser`, {
    ...POST_PARAMS,
    body: JSON.stringify({ user: user }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const searchUser = async (search: string) => {
  return fetch(`${apiUrl}/user/searchUser`, {
    ...POST_PARAMS,
    body: JSON.stringify({ search: search }),
  })
    .then((res) => res.json())
    .then((res) => res);
};

export const getStatus = async(userId: string) => {
  return fetch(`${apiUrl}/status/getStatus/${userId}`)
    .then((res) => res.json())
    .then((res) => res);
};

export const postStatus = async (user: { id: string; phone: string; profile: { name: string; username: string; avatar: string; bio: string; }; }, status: { id: string; createdAt: number; type: string; content: string; color: string; }) => {
  return fetch(`${apiUrl}/status/postStatus`, {
    ...POST_PARAMS,
    body: JSON.stringify({ user, status }),
  })
    .then((res) => res.json())
    .then((res) => res);
};