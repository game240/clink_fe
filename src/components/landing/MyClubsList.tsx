import type { ClubResponse } from "../../types/landing/club";
import ClubListItem from "./ClubListItem";

interface MyClubsListProps {
  children?: string;
  clubList: ClubResponse[];
}

const MyClubsList = ({ children, clubList }: MyClubsListProps) => {
  return (
    clubList.length > 0 && (
      <section className="flex flex-col gap-[50px]">
        {children && (
          <h1 className="text-head-lg-b text-gray-08">{children}</h1>
        )}
        <section className="grid grid-cols-4 gap-x-[32px] gap-y-[50px]">
          {clubList.map((club) => (
            <ClubListItem
              key={club.id}
              id={club.id}
              name={club.name}
              location={club.location}
              members={club.members}
              description={club.description}
              thumbnailUrl={club.thumbnailUrl}
            />
          ))}
        </section>
      </section>
    )
  );
};

export default MyClubsList;
