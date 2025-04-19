import ChannelConnect from "@/components/ChannelConnect";
import { useNavigate } from "react-router-dom";
const AddChannelPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return <div className="container mx-auto py-12 max-w-7xl bg-white">
      <ChannelConnect onBack={handleBack} />
    </div>;
};
export default AddChannelPage;