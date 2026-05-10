import Hero from "../components/Hero";
import OpeningScreen from '../components/OpeningScreen';
import InvitationSection from "../components/InvitationSection";
import ContactSection from "../components/ContactSection";
import MessagesSection from "../components/MessagesSection";

const Home = () => {
  return (
    <>
    
      <Hero />
       <OpeningScreen/>
      <InvitationSection />
      <ContactSection />
      <MessagesSection />
    </>
  );
};

export default Home;
