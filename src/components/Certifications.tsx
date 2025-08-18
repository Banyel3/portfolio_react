import Cert_Card from "./cert_card";
import {Element} from "react-scroll";

const Cert_Card_Prop = [
    {
        title: "Fortinet CS1",
        description: "Fortinet's premium Certification for Cybersecurity",
        Date_Acquired: "2023-10-01",
        Validity: "3 years",
        link: 'https://www.fortinet.com/certification/certified-security-professional'
    },
   
    {
        title: "Fortinet CS2",
        description: "Fortinet's premium Certification for Cybersecurity",
        Date_Acquired: "2023-10-01",
        Validity: "3 years",
        link: 'https://www.fortinet.com/certification/certified-security-professional'
    },
   
    {
        title: "Fortinet CS3",
        description: "Fortinet's premium Certification for Cybersecurity",
        Date_Acquired: "2023-10-01",
        Validity: "3 years",
        link: 'https://www.fortinet.com/certification/certified-security-professional'
    },
    {
        title: "Fortinet CS4",
        description: "Fortinet's premium Certification for Cybersecurity",
        Date_Acquired: "2023-10-01",
        Validity: "3 years",
        link: 'https://www.fortinet.com/certification/certified-security-professional'
    },
   
    {
        title: "Fortinet CS5",
        description: "Fortinet's premium Certification for Cybersecurity",
        Date_Acquired: "2023-10-01",
        Validity: "3 years",
        link: 'https://www.fortinet.com/certification/certified-security-professional'
    },
   
    {
        title: "Fortinet CS6",
        description: "Fortinet's premium Certification for Cybersecurity",
        Date_Acquired: "2023-10-01",
        Validity: "3 years",
        link: 'https://www.fortinet.com/certification/certified-security-professional'
    }
   
]


function Cert(){
return (

<>
<Element name="Certs" />
    <div className="bg-base-200 min-h-screen px-20">
        <h1 className="pt-2 text-5xl text-center font-bold text-white">Certifications</h1>
        <div className="flex flex-wrap justify-center items-center gap-10 p-10">
                {Cert_Card_Prop.map((cert, index) => (
                <Cert_Card key={index} {...cert} />
            ))}
        </div>
    </div>
</>
)
}


export default Cert;