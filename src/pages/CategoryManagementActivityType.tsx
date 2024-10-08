import React, { useState, useEffect } from "react";
import { Input, Button, Tag, Divider, Form, message } from "antd";
import {
  getAllActivityTypes,
  createActivityType,
  deleteActivityType,
} from "../api";
import { ActivityType, ActivityTypeResponse } from "../types";
import UnauthorizedModal from "../components/modals/UnauthorizedModal";

const CategoryManagementActivityType: React.FC = () => {
  const [activityTypes, setActivityTypes] = useState<ActivityTypeResponse[]>(
    []
  );
  const [inputValue, setInputValue] = useState("");
  const [isUnauthorizedModalVisible, setIsUnauthorizedModalVisible] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchActivityTypes = async () => {
    try {
      const response = await getAllActivityTypes();
      setActivityTypes(response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Unauthorized") {
          setIsUnauthorizedModalVisible(true);
        }
        setErrorMessage(error.message);
        console.log(errorMessage);
      } else {
        setErrorMessage(String(error));
      }
      console.error("Failed to load activity types");
    }
  };

  useEffect(() => {
    fetchActivityTypes(); // Initial fetch
  }, []);

  const handleAddActivityType = async () => {
    if (inputValue) {
      const newActivityType: ActivityType = {
        activity_type: inputValue,
      };

      try {
        console.log("here");
        await createActivityType(newActivityType);
        // Fetch updated activity types
        const response = await getAllActivityTypes();
        setActivityTypes(response);
        setInputValue("");
        message.success("Activity type added successfully");
      } catch (error) {
        message.error("Failed to add activity type");
      }
    } else {
      message.error("Please enter an activity type.");
    }
  };

  const handleRemoveActivityType = async (id: string) => {
    try {
      await deleteActivityType(id);
      setActivityTypes(activityTypes.filter((item) => item.ID !== id));
      message.success("Activity type deleted successfully");
    } catch (error) {
      message.error("Failed to delete activity type");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddActivityType();
    }
  };

  return (
    <div className="settings-management-container">
      <h1>Category Management</h1>
      <p>
        Please note that changes made here will affect the field options in the
        forms on this portal.
      </p>
      <Divider />
      <h2>Activity Types</h2>
      <p>
        Information added here will be reflected under the Activity Type field
        when creating a new shipment.
      </p>
      <Form layout="inline">
        <Form.Item>
          <Input
            placeholder="Press Enter to add"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAddActivityType}>
            Add
          </Button>
        </Form.Item>
      </Form>
      <Divider />
      <h3>Existing Types</h3>
      {activityTypes && activityTypes.length > 0 ? (
        <div>
          {activityTypes.map((type) => (
            <Tag
              key={type.ID}
              closable
              onClose={() => handleRemoveActivityType(type.ID)}
              style={{ marginBottom: 8 }}
            >
              {type.activity_type}
            </Tag>
          ))}
        </div>
      ) : (
        <p>No activity types</p>
      )}
      <UnauthorizedModal
        visible={isUnauthorizedModalVisible}
        onClose={() => setIsUnauthorizedModalVisible(false)}
      />
    </div>
  );
};

export default CategoryManagementActivityType;
