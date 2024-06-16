import React from "react";
import { Tag } from "antd";
import moment from "moment";
import { Activity } from "../../types";

interface StatusTagProps {
  activity: Activity;
}

const StatusTag: React.FC<StatusTagProps> = ({ activity }) => {
  const now = moment();
  console.log(activity, " activity");
  const readiness = activity.readiness ? moment(activity.readiness) : null;
  const etb = activity.etb ? moment(activity.etb) : null;
  const etd = activity.etd ? moment(activity.etd) : null;

  if (!readiness) {
    return <Tag color="red">No Readiness</Tag>;
  }
  if (now.isBefore(readiness)) {
    return <Tag color="blue">Planned</Tag>;
  }
  if (now.isBetween(readiness, etb)) {
    return <Tag color="brown">Activity Commenced</Tag>;
  }
  if (now.isBetween(etb, etd)) {
    return <Tag color="yellow">Ongoing</Tag>;
  }
  if (now.isAfter(etd)) {
    return <Tag color="green">Completed</Tag>;
  }
  return <Tag>Unknown</Tag>;
};

export default StatusTag;
