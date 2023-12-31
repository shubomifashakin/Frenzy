import { create } from "zustand";
import { supabase } from "../Helpers/supabase";
import Compressor from "compressorjs";

const initialState = {
  posts: [],
  loadingPosts: false,
  error: "",
};
export const PostStore = create(function (set) {
  return {
    ...initialState,

    getPosts: async function (id) {
      try {
        set(() => ({ loadingPosts: true, error: "" }));

        //fetch the posts
        let { data: Posts, error } = await supabase
          .from("Posts")
          .select("*")
          .eq("userId", id);

        //if there was an error handle it
        if (error?.message) {
          throw new Error(error.message);
        }

        //if the posts were fetched, store it
        set(() => ({ loadingPosts: false, posts: Posts }));
      } catch (err) {
        //store the error caught
        set((state) => ({ loadingPosts: false, error: err }));
      }
    },

    uploadPost: async function (postDetails) {
      const { image, content } = postDetails;
      let postInfo;
      let compressedBlob;

      try {
        //if the user uploaded an image
        if (image.length) {
          //get the imageFile
          const imgFile = image[0];

          //compress the image, returns the compressed filed
          compressedBlob = await new Promise((resolve, reject) => {
            new Compressor(imgFile, {
              quality: 0.1, // Adjust the desired image quality (0.0 - 1.0)
              maxWidth: 400, // Adjust the maximum width of the compressed image
              maxHeight: 800, // Adjust the maximum height of the compressed image
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
          const imageUrl = `https://jmfwsnwrjdahhxvtvqgq.supabase.co/storage/v1/object/sign/postImages/${compressedBlob.name}`;

          //the post data we want to send to the database
          postInfo = { image: imageUrl, userId, content };
        }

        //images are not compulsory to upload, so if the user didnt upload an image
        else {
          //the post data to send to the database
          postInfo = { userId, content };
        }

        //send the data to the posts Table
        const { data, error } = await supabase.from("Posts").insert(postInfo);

        //if there was an error sending the post data to database, throw it
        if (error?.message) {
          throw new Error(error.message);
        }

        //if there was an image, upload that image to the storage bucket
        if (image.length) {
          const { error: imageError } = await supabase.storage
            .from("postImages")
            .upload(compressedBlob.name, compressedBlob);

          //if there was an error uploading the image
          if (imageError) {
            throw new Error(imageError.message);
          }
        }
      } catch (error) {
        //store the error caught
        set((state) => ({ loadingPosts: false, error: error }));
      }
    },
  };
});
