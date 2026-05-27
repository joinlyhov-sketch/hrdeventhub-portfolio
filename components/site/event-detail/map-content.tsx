export default function MapContentComponent() {
  return (
    <section className="flex flex-col items-start justify-between h-full pt-2 w-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.9!2d104.9282!3d11.5799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sToul+Kork%2C+Phnom+Penh!5e0!3m2!1sen!2skh!4v1"
        width="100%"
        height="200"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="rounded-xl"
      ></iframe>
      <a href="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.9!2d104.9282!3d11.5799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sToul+Kork%2C+Phnom+Penh!5e0!3m2!1sen!2skh!4v1">
        https://www.google.com/maps
      </a>
    </section>
  );
}
