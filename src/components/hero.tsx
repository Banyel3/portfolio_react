import { Button } from "@/components/ui/button.tsx";
import heroImg from "@/assets/hero_pic.jpg";
function Hero(){
   return ( <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row" id="home">
    <img
      src={heroImg}
      className="max-w-sm rounded-lg shadow-2xl"
    />
    <div>
      <h4 className="mb-2 text-3xl font-[Montserrat] font-light text-white">Hello I'm</h4>
      <h2 className="text-5xl text-blue-600 font-bold">Vaniel John Cornelio</h2>
      <p className="py-6 text-white">
        Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat in id cursus mi pretium tellus duis. Urna tempor pulvinar vivamus fringilla lacus nec metus. Integer nunc posuere ut hendrerit semper vel class. Conubia nostra inceptos himenaeos orci varius natoque penatibus. Mus donec rhoncus eros lobortis nulla molestie mattis. Purus est efficitur laoreet mauris pharetra vestibulum fusce. Sodales consequat magna ante condimentum neque at luctus. Ligula congue sollicitudin erat viverra ac tincidunt nam. Lectus commodo augue arcu dignissim velit aliquam imperdiet. Cras eleifend turpis fames primis vulputate ornare sagittis. Libero feugiat tristique accumsan maecenas potenti ultricies habitant. Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus ex sapien vitae pellentesque sem placerat in. Tempus leo eu aenean sed diam urna tempor.
      </p>
      <Button asChild><a href="/about">Get Started</a></Button>
    </div>
  </div>
</div>
   );
}

export default Hero;