export const clinic = {
  name: 'Nagar Hearing And Speech Centre',
  phone: '9403885143',
  phoneDisplay: '+91 94038 85143',
  email: 'nagarhearing@gmail.com',
  address: 'Nagar Hearing and Speech Centre ,Near Morya Mangal Karyalaya, Savedi, Ahilyanagar, Maharashtra 414003',
  landmark: 'Located inside Kulkarni ENT & Maternity Hospital',
  hours: 'Open today · Closes 8:00 PM',
  mapsQuery: 'Nagar+Hearing+And+Speech+Centre+Near+Morya|Mangal|Karyalaya+Savedi+Ahilyanagar',
}

export const telHref = `tel:+91${clinic.phone}`
export const whatsappHref = (message = "Hi, I'd like to enquire about your services at Nagar Hearing And Speech Centre.") =>
  `https://wa.me/91${clinic.phone}?text=${encodeURIComponent(message)}`
export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${clinic.mapsQuery}`
