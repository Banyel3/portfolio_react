import { Button } from "@/components/ui/button.tsx";
import { Element } from "react-scroll";
import cyberSec from "@/assets/cybersec.webp";

function About() {
  return (
    <>
      <Element name="About" />
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img src={cyberSec} className="max-w-md rounded-xxl shadow-2xl" />
          <div>
            <h1 className="text-5xl font-bold text-white">About Me</h1>
            <p className="py-6 text-white">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Placerat
              in id cursus mi pretium tellus duis. Urna tempor pulvinar vivamus
              fringilla lacus nec metus. Integer nunc posuere ut hendrerit
              semper vel class. Conubia nostra inceptos himenaeos orci varius
              natoque penatibus. Mus donec rhoncus eros lobortis nulla molestie
              mattis. Purus est efficitur laoreet mauris pharetra vestibulum
              fusce. Sodales consequat magna ante condimentum neque at luctus.
              Ligula congue sollicitudin erat viverra ac tincidunt nam. Lectus
              commodo augue arcu dignissim velit aliquam imperdiet. Cras
              eleifend turpis fames primis vulputate ornare sagittis. Libero
              feugiat tristique accumsan maecenas potenti ultricies habitant.
              Cubilia curae hac habitasse platea dictumst lorem ipsum. Faucibus
              ex sapien vitae pellentesque sem placerat in. Tempus leo eu aenean
              sed diam urna tempor.
            </p>
            <ol className="text-white">
              <li>Bla</li>
              <li>Dolor</li>
            </ol>
            <Button asChild>Get Started</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
