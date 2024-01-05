import Compressor from "compressorjs";
import { supabase } from "../Helpers/supabase";

function trimWord(word) {
  const trimmedWord = word.toLowerCase().trim();
  return trimmedWord;
}

export function sortPostsFromLatestToOldest(array) {
  // Sort the posts array based on the 'created_at' property in descending order
  array.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return array;
}

export async function logInUser(userInfo) {
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword(userInfo);

  //if there was an error logging in, show it
  if (error) {
    throw new Error(error.message);
  }
}

export async function signUpUser(userInfo) {
  const { email, password, userName } = userInfo;

  const trimmedEmail = trimWord(email);
  const trimedUsername = trimWord(userName);

  //create the user with these details
  const { data: createdUser, error: createError } = await supabase.auth.signUp({
    email: trimmedEmail,
    password,
    options: { data: { userName: trimedUsername } },
  });

  //if there was an error signing up
  if (createError?.message) {
    throw new Error(createError.message);
  }
}

export async function getPosts(id) {
  //fetch the posts for this particular id
  let { data: Posts, error } = await supabase
    .from("Posts")
    .select("*")
    .eq("user_id", id);

  //if there was an error handle it
  if (error?.message) {
    throw new Error(error.message);
  }

  //if the posts were fetched, store it
  return Posts;
}

export async function uploadPost(postDetails) {
  const { image, postContent: content, id: user_id, username } = postDetails;

  let postInfo;
  let compressedBlob;
  let imageName;

  //if the user uploaded an image
  if (image) {
    //create a unique image name
    imageName = image.name.replaceAll(/[./?()]/gi, "") + Date.now();

    //compress the image, returns the compressed file
    compressedBlob = await new Promise((resolve, reject) => {
      new Compressor(image, {
        quality: 1, // Adjust the desired image quality (0.0 - 1.0)
        maxWidth: 400, // Adjust the maximum width of the compressed image
        maxHeight: 400, // Adjust the maximum height of the compressed image
        mimeType: "image/jpeg", // Specify the output image format

        success(result) {
          resolve(result);
        },

        //if the compression failed, it returns an error that is caught in the catch block
        error(error) {
          reject(error);
        },
      });
    });

    //if compression worked, form the link to the image in supabase storage
    const imageUrl = `https://jmfwsnwrjdahhxvtvqgq.supabase.co/storage/v1/object/public/postImages/${imageName}`;

    //the post data we want to send to the database
    postInfo = { image: imageUrl, user_id, content, username };

    //send the data to the posts & images to the Table
    const [posts, images] = await Promise.all([
      supabase.from("Posts").insert(postInfo),
      supabase.storage.from("postImages").upload(imageName, compressedBlob),
    ]);

    //if there was an error sending the post data to database, throw it
    if (posts?.error?.message) {
      throw new Error(posts.error.message);
    }
    //if there was an error sending the post data to database, throw it
    if (images?.error?.message) {
      throw new Error(images.error.message);
    }
  }

  //images are not compulsory to upload, so if the user didnt upload an image
  else {
    //the post data to send to the database
    postInfo = { user_id, content, username };

    //send the posts data to the table
    const { data, error } = await supabase.from("Posts").insert(postInfo);

    if (error?.message) {
      throw new Error(error.message);
    }
  }
}

export async function getUsersInfo(id) {
  let { data: UsersInfo, error } = await supabase
    .from("UsersInfo")
    .select("*")
    .eq("id", id);

  if (error?.message) {
    throw new Error(error.message);
  }

  return UsersInfo[0];
}

export async function getAllPostsByUsers() {
  let { data: Posts, error } = await supabase.from("Posts").select("*");

  if (error?.message) {
    throw new Error(error.message);
  }

  return Posts;
}

export async function getSinglePost(postId) {
  let { data: Posts, error } = await supabase
    .from("Posts")
    .select("*")
    .eq("id", postId);

  if (error?.message) {
    throw new Error(error.message);
  }

  return Posts[0];
}

export async function updateUsername(newUsername) {
  //gets the id  from the local storage
  const {
    user: { id },
  } = JSON.parse(localStorage.getItem("sb-jmfwsnwrjdahhxvtvqgq-auth-token"));

  const { data, error } = await supabase
    .from("UsersInfo")
    .update({ username: `"${trimWord(newUsername)}"` })
    .eq("id", id);

  if (error?.message) {
    throw new Error(error.message);
  }
}
