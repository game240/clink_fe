import ic_more from "../../assets/landing/ic_more.svg";
import ic_location from "../../assets/landing/ic_location.svg";
import ic_member from "../../assets/landing/ic_member.svg";
import ic_dot from "../../assets/landing/ic_dot.svg";
import speech_bubble from "../../assets/landing/speech_bubble.svg";

interface ClubListItemProps {
  name: string;
  location: string;
  members: number;
  description: string;
}

const ClubListItem = ({
  name,
  location,
  members,
  description,
}: ClubListItemProps) => {
  return (
    <div className="flex flex-col gap-[20px] w-[340px]">
      <div className="w-full aspect-square rounded-[20px] bg-gray-200"></div>
      <section>
        <div className="flex justify-between w-full">
          <p className="text-title-md-b">{name}</p>
          <img src={ic_more} alt="" />
        </div>
        <div className="flex gap-[10px] mt-[10px] mb-[13.46px]">
          <div className="flex gap-[6px]">
            <img src={ic_location} alt="" />
            <p>{location}</p>
          </div>
          <img src={ic_dot} alt="" />
          <div className="flex gap-[6px]">
            <img src={ic_member} alt="" />
            <p>멤버 {members}</p>
          </div>
        </div>
        <div className="relative w-[320px] h-[84px]">
          <img src={speech_bubble} alt="" />
          <p className="absolute bottom-0 left-0 p-[16px] text-text-md-m text-gray-07">
            {description}
          </p>
        </div>
      </section>
    </div>
  );
};

export default ClubListItem;
