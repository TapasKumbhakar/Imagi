import React from "react";
import { assets, testimonialsData } from "../assets/assets";
// eslint-disable-next-line
import { motion } from "framer-motion";


const Testimonials = () => {
  return (
    <motion.div
    initial={{ opacity: 0.2, y: 100 }}
    transition={{ duration: 1 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} 
    className="flex flex-col items-center justify-center my-20 py-12">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
        Customer Testimonials
      </h1>
      <p className="text-grey-500 mb-12">What Our User Are Saying.</p>
      <div className="flex flex-wrap gap-6">
        {testimonialsData.map((testimonial, index) => (
          <div
            key={index}
            className=" flex items-center gap-4  px-8 bg-white/80 p-12 rounded-xl shadow-md border-gray-600 w-80 m-auto cursor-pointer hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex flex-col items-center">
              <img
                src={testimonial.image}
                alt=" "
                className=" w-14 rounded-full "
              />
              <h2 className="text-xl fontr-semibold mt-3">
                {testimonial.name}
              </h2>
              <p className="text-grey-500 mb-4">{testimonial.role}</p>
              <div className="flex mb-4">
                {Array(testimonial.stars)
                  .fill()
                  .map((item, index) => (
                    <img key={index} src={assets.rating_star} alt="" />
                  ))}
              </div>
              <p className="text-center text-sm text-grey-600">
                {testimonial.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Testimonials;
