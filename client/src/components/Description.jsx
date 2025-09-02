import React from "react";
import { assets } from "../assets/assets";
// eslint-disable-next-line
import { motion } from "framer-motion";

const Description = () => {
  return (
    <motion.div 
    initial={{ opacity: 0.2, y: 100 }}
    transition={{ duration: 1 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex flex-col items-center justify-center  p-6 my-24 md:px-28">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
        Create AI Images
      </h1>
      <p className="text-grey-500 mb-8">
        Generate stunning images from text prompts using advanced AI technology.
      </p>

      <div className="flex flex-col gap-5 md:gap-14 md:flex-row items-center justify-center mt-20">
        <img
          src={assets.sample_img_1}
          alt=""
          className="w-80 xl:w-96 rounded-lg"
        />

        <div>
          <h2 className="text-3xl font-medium max-w-lg mb-4">Introducing the AI-Powerded Text to Image Generator</h2>
          <p className="text-grey-600 mb-4">
            Easily bring your ideas to life with our free AI image generator. Whether you need a unique image for your blog, social media, or marketing materials, our tool can help you create stunning visuals in seconds. Our tols transforms your text into eay-catching images with just a few clicks. Imagine it, and watch it comes to life instantly.
          </p>

          <p className="text-grey-600">
            Simply type in your text prompt, and our AI will generate a high-quality image that matches your description.From product visuals to character design =s and portraits, even concepts that don't yet exist can be visualized effortlessely. Powerde by advanced machine learning algorithms, our tool understands context and can create images that are not only visually appealing but also relevant to your needs.
          </p>
          
        </div>
      </div>
    </motion.div>
  );
};

export default Description;
