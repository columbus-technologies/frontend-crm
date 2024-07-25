import { Descriptions } from "antd";
import { ShipmentResponse } from "../../types";

const renderVesselDetails = (selectedShipment: ShipmentResponse | null) => {
  if (!selectedShipment) return <p>No shipment selected.</p>;
  return (
    <Descriptions
      bordered
      title="Vessel Specifications"
      className="styled-descriptions"
      column={2} // Set the number of columns to 2
    >
      <Descriptions.Item label="IMO Number">
        {selectedShipment.vessel_specifications.imo_number}
      </Descriptions.Item>
      <Descriptions.Item label="Call Sign">
        {selectedShipment.vessel_specifications.call_sign}
      </Descriptions.Item>
      <Descriptions.Item label="DWT">
        {selectedShipment.vessel_specifications.sdwt}
      </Descriptions.Item>
      <Descriptions.Item label="NRT">
        {selectedShipment.vessel_specifications.nrt}
      </Descriptions.Item>
      <Descriptions.Item label="Vessel Name">
        {selectedShipment.vessel_specifications.vessel_name}
      </Descriptions.Item>
      <Descriptions.Item label="Flag">
        {selectedShipment.vessel_specifications.flag}
      </Descriptions.Item>
      <Descriptions.Item label="LOA">
        {selectedShipment.vessel_specifications.loa}
      </Descriptions.Item>
      <Descriptions.Item label="GRT">
        {selectedShipment.vessel_specifications.grt}
      </Descriptions.Item>
    </Descriptions>
  );
};

export { renderVesselDetails };
