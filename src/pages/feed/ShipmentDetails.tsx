import { Descriptions } from "antd";
import { formatDateToLocalString } from "../../utils/dateTimeUtils";
import { ShipmentResponse } from "../../types";

const renderShipmentProducts = (products: any[]) => {
  return (
    <Descriptions.Item label="Product Quantity">
      <div className="shipment-products">
        {products.map((product, index) => (
          <div className="shipment-product" key={index}>
            <div>Sub-Product: {product.sub_product_type}</div>
            <div>
              Approx. Qty: {product.quantity} {product.quantity_code}
            </div>
          </div>
        ))}
      </div>
    </Descriptions.Item>
  );
};

const renderCargoOperationsActivities = (activities: any[]) => {
  return activities.map((activity, index) => (
    <Descriptions
      key={index}
      title={`Cargo Operations Activity ${index + 1}`}
      bordered
      className="styled-descriptions"
      column={2} // Set the number of columns to 2
    >
      <Descriptions.Item label="Activity Type">
        {activity.activity_type}
      </Descriptions.Item>
      <Descriptions.Item label="Customer Name">
        {activity.customer_name}
      </Descriptions.Item>
      <Descriptions.Item label="Terminal">
        {activity.terminal_name}
      </Descriptions.Item>
      {renderShipmentProducts(activity.shipment_product)}
      <Descriptions.Item label="Arrival Displacement">
        {activity.arrival_departure_information.arrival_displacement} tonnes
      </Descriptions.Item>
      <Descriptions.Item label="Departure Displacement">
        {activity.arrival_departure_information.departure_displacement} tonnes
      </Descriptions.Item>
      <Descriptions.Item label="Arrival Draft">
        {activity.arrival_departure_information.arrival_draft} metres
      </Descriptions.Item>
      <Descriptions.Item label="Departure Draft">
        {activity.arrival_departure_information.departure_draft} metres
      </Descriptions.Item>
      <Descriptions.Item label="Arrival Mast Height">
        {activity.arrival_departure_information.arrival_mast_height} metres
      </Descriptions.Item>
      <Descriptions.Item label="Departure Mast Height">
        {activity.arrival_departure_information.departure_mast_height} metres
      </Descriptions.Item>
      <Descriptions.Item label="Readiness">
        {formatDateToLocalString(activity.readiness)}
      </Descriptions.Item>
      <Descriptions.Item label="ETB">
        {formatDateToLocalString(activity.etb)}
      </Descriptions.Item>
      <Descriptions.Item label="ETD">
        {formatDateToLocalString(activity.etd)}
      </Descriptions.Item>
    </Descriptions>
  ));
};

const renderBunkerIntakeSpecifications = (specifications: any[]) => {
  return (
    <Descriptions.Item label="Product Maximum Intake and Hose Size">
      <div className="bunker-intake-specifications">
        {specifications.map((specification, index) => (
          <div className="bunker-intake-specification" key={index}>
            <div>Sub-Product: {specification.sub_product_type}</div>
            <div>
              Maximum Quantity Intake: {specification.maximum_quantity_intake}{" "}
              m^3
            </div>
            <div>
              Maximum Hose Size: {specification.maximum_hose_size} inches
            </div>
          </div>
        ))}
      </div>
    </Descriptions.Item>
  );
};

const renderBunkeringActivity = (activities: any[]) => {
  return activities.map((activity, index) => (
    <Descriptions
      key={index}
      title={`Bunkering ${index + 1}`}
      bordered
      className="styled-descriptions"
      column={2} // Set the number of columns to 2
    >
      <Descriptions.Item label="Customer">
        {activity.customer_name}
      </Descriptions.Item>
      <Descriptions.Item label="Supplier">
        {activity.supplier}
      </Descriptions.Item>
      <Descriptions.Item label="Supplier Contact">
        {activity.supplier_contact}
      </Descriptions.Item>
      <Descriptions.Item label="Appointed Surveyor">
        {activity.appointed_surveyor}
      </Descriptions.Item>
      <Descriptions.Item label="Docking">{activity.docking}</Descriptions.Item>
      {renderBunkerIntakeSpecifications(activity.bunker_intake_specifications)}
      <Descriptions.Item label="Freeboard">
        {activity.freeboard} metres
      </Descriptions.Item>
      <Descriptions.Item label="Readiness">
        {formatDateToLocalString(activity.readiness)}
      </Descriptions.Item>
      <Descriptions.Item label="ETB">
        {formatDateToLocalString(activity.etb)}
      </Descriptions.Item>
      <Descriptions.Item label="ETD">
        {formatDateToLocalString(activity.etd)}
      </Descriptions.Item>
    </Descriptions>
  ));
};

const renderShipmentDetails = (selectedShipment: ShipmentResponse | null) => {
  if (!selectedShipment) return <p>No shipment selected.</p>;

  return (
    <div>
      {renderCargoOperationsActivities(
        selectedShipment.shipment_type.cargo_operations
          .cargo_operations_activity
      )}
      {renderBunkeringActivity(
        selectedShipment.shipment_type.bunkering.bunkering_activity
      )}
    </div>
  );
};

export { renderShipmentDetails };
