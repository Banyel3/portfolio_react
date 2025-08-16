
type Cert_Card_Prop ={
    title: string,
    description: string,
    Date_Acquired: string,
    Validity: string,
    link?: string
}
export default function Cert_Card({title, description, Date_Acquired, Validity, link}: Cert_Card_Prop) {
    return (
        <div className="card bg-base-100 w-96 shadow-sm mt-10">
  <figure>
    <img
      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
      alt="Shoes" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{title}</h2>
    <p>{description}</p>
    <p>{Date_Acquired}</p>
    <p>{Validity}</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary"><a href={link}>More Info</a></button>
    </div>
  </div>
</div>
    )
}