import dineInImg from "../../assets/feeling/eatwella_dinein.jpeg";
import pickupImg from "../../assets/feeling/eatwella_pickup.jpeg";
import deliveryImg from "../../assets/feeling/eatwella_delivery.jpeg";

function Feeling() {
  const sections = [
    {
      id: 1,
      image: dineInImg,
      title: "Dine In",
      description: "Experience the ambiance and taste of our restaurant.",
      align: "left",
    },
    {
      id: 2,
      image: pickupImg,
      title: "Pick Up",
      description: "Order ahead and skip the line.",
      align: "left",
    },
    {
      id: 3,
      image: deliveryImg,
      title: "Delivery",
      description: "Your favorite meals delivered to your doorstep.",
      align: "left",
    },
  ];

  return (
    <div className="w-full overflow-hidden">
      {sections.map((section) => (
        <div
          key={section.id}
          className={`relative w-full h-[80vh] lg:h-[100vh] bg-fixed bg-[length:400%] lg:bg-[length:200%] xl:bg-[length:120%] ${section.title === "Dine In" ? "bg-[position:bottom]" : "bg-center"} flex items-center bg-no-repeat`}
          style={{
            backgroundImage: `url(${section.image})`,
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content */}
          <div
            className={`relative z-10 container mx-auto px-6 md:px-12 flex ${section.align === "right" ? "justify-end text-right" : "justify-start"}`}
          >
            <div className="max-w-xl text-white">
              <h2 className="text-5xl md:text-7xl font-black font-bolota mb-4 tracking-tight drop-shadow-lg">
                {section.title}
              </h2>
              <p className="text-xl md:text-2xl font-medium text-gray-100 drop-shadow-md">
                {section.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feeling;
