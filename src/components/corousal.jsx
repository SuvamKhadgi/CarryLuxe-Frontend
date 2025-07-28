import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useEffect, useState } from "react";
import cour1 from "../assets/images/cour1.png";
import cour2 from "../assets/images/cour2.png";
import cour3 from "../assets/images/cour3.png";

const Corousal = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, content: "Slide 1", image: cour1 },
    { id: 2, content: "Slide 2", image: cour2 },
    { id: 3, content: "Slide 3", image: cour3 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full  flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-6">
      {/* Carousel Container */}
      <div className="overflow-hidden w-full max-w-7xl rounded-xl shadow-lg">
        <div
          className="flex transition-transform h- duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="w-full flex-shrink-0  flex justify-center items-center px-2"
            >
              <div className="w-full h-[50vh] sm:h-[55vh] md:h-[75vh] flex justify-center items-center bg-white">
                <img
                  src={slide.image}
                  alt={slide.content}
                  className="h-full w-full object-fill"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Left Button */}
      <button
        className="absolute left-2 sm:left-4 md:left-8 top-1/2 transform -translate-y-1/2 text-black bg-white bg-opacity-60 hover:bg-opacity-80 p-2 sm:p-3 rounded-full shadow z-4"
        onClick={() =>
          setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        }
      >
        <ChevronLeft sx={{ fontSize: { xs: 32, sm: 40, md: 48 } }} />
      </button>

      {/* Right Button */}
      <button
        className="absolute right-2 sm:right-4 md:right-8 top-1/2 transform -translate-y-1/2 text-black bg-white bg-opacity-60 hover:bg-opacity-80 p-2 sm:p-3 rounded-full shadow z-3"
        onClick={() =>
          setCurrentSlide((prev) => (prev + 1) % slides.length)
        }
      >
        <ChevronRight sx={{ fontSize: { xs: 32, sm: 40, md: 48 } }} />
      </button>
    </div>
  );
};

export default Corousal;
