import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getShipmentStatusesWithColours } from "../api";

const StatusColoursContext = createContext<{ [key: string]: string }>({});

interface StatusColoursProviderProps {
  children: ReactNode;
}

export const StatusColoursProvider: React.FC<StatusColoursProviderProps> = ({
  children,
}) => {
  const [statusColours, setStatusColours] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const fetchStatusColours = async () => {
      try {
        const fetchedStatusColours = await getShipmentStatusesWithColours();
        const statusColoursObject: { [key: string]: string } = {};
        Object.entries(fetchedStatusColours).forEach(([status, color]) => {
          statusColoursObject[status] = color;
        });
        setStatusColours(statusColoursObject);
      } catch (error) {
        console.error("Failed to fetch status Colours:", error);
      }
    };

    fetchStatusColours();
  }, []);

  return (
    <StatusColoursContext.Provider value={statusColours}>
      {children}
    </StatusColoursContext.Provider>
  );
};

export const useStatusColours = (): { [key: string]: string } => {
  return useContext(StatusColoursContext);
};
