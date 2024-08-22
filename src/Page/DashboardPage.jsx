import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const initialDashboardPage = {
  categories: [
    {
      id: 1,
      name: "CSPM Executive Dashboard",
      widgets: [
        {
          id: 1,
          name: "Widget 1",
          text: "Random text for Widget 1",
          chartData: {
            labels: ["Red", "Blue", "Yellow"],
            datasets: [
              {
                label: "Votes",
                data: [300, 50, 100],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              },
            ],
          },
        },
        {
          id: 2,
          name: "Widget 2",
          text: "Random text for Widget 2",
          chartData: {
            labels: ["Green", "Purple", "Orange"],
            datasets: [
              {
                label: "Votes",
                data: [200, 150, 80],
                backgroundColor: ["#4BC0C0", "#9966FF", "#FF9F40"],
                hoverBackgroundColor: ["#4BC0C0", "#9966FF", "#FF9F40"],
              },
            ],
          },
        },
      ],
    },
  ],
};

const DashboardPage = () => {
  const [dashboardPage, setDashboardPage] = useState(initialDashboardPage);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [widgetName, setWidgetName] = useState("");
  const [widgetText, setWidgetText] = useState("");

  const addWidget = (categoryId, widgetName, widgetText, chartData) => {
    setDashboardPage((prevDashboardPage) => {
      const updatedCategories = prevDashboardPage.categories.map((category) => {
        if (category.id === categoryId) {
          const newWidget = {
            id: category.widgets.length + 1,
            name: widgetName,
            text: widgetText,
            chartData: chartData,
          };
          return {
            ...category,
            widgets: [...category.widgets, newWidget],
          };
        }
        return category;
      });
      return { ...prevDashboardPage, categories: updatedCategories };
    });
    setWidgetName("");
    setWidgetText("");
    setIsSidebarOpen(false);
  };

  const removeWidget = (categoryId, widgetId) => {
    setDashboardPage((prevDashboardPage) => {
      const updatedCategories = prevDashboardPage.categories.map((category) => {
        if (category.id === categoryId) {
          const updatedWidgets = category.widgets.filter(
            (widget) => widget.id !== widgetId
          );
          return { ...category, widgets: updatedWidgets };
        }
        return category;
      });
      return { ...prevDashboardPage, categories: updatedCategories };
    });
  };

  const filteredWidgets = (widgets) => {
    return widgets.filter((widget) =>
      widget.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleAddWidgetClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setIsSidebarOpen(true);
  };

  return (
    <div className="relative flex p-4">
      {/* Main Content Area */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search Widgets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-5 p-2 w-full border border-gray-300 rounded"
        />
        {dashboardPage.categories.map((category) => (
          <div key={category.id} className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-xl font-bold mb-4">{category.name}</h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredWidgets(category.widgets).map((widget) => (
                <div
                  key={widget.id}
                  className="relative bg-white rounded-lg shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold">{widget.name}</h3>
                  <p className="mb-4">{widget.text}</p>
                  <Doughnut data={widget.chartData} />
                  <button
                    onClick={() => removeWidget(category.id, widget.id)}
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}

              {/* Card 3 Always at the End */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold">Card 3</h2>
                <p className="text-gray-700">This card is always at the end.</p>
                <button
                  onClick={() => handleAddWidgetClick(category.id)} // Open the sidebar
                  className="mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add New Widget
                </button>
              </div>
            </div>

            <hr className="mt-6" />
          </div>
        ))}
      </div>

      {/* Sidebar (conditionally rendered) */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-6 transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Add New Widget</h3>
          <button
            onClick={() => setIsSidebarOpen(false)} // Close the sidebar
            className="text-gray-600 hover:text-red-600"
          >
            <FaTimes />
          </button>
        </div>
        <div>
          {/* Sidebar Form to add new widget */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (widgetName && widgetText) {
                addWidget(selectedCategoryId, widgetName, widgetText, {
                  labels: ["Label 1", "Label 2", "Label 3"],
                  datasets: [
                    {
                      label: "Votes",
                      data: [100, 100, 100],
                      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                      hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                    },
                  ],
                });
              }
            }}
          >
            <input
              type="text"
              placeholder="Widget Name"
              value={widgetName}
              onChange={(e) => setWidgetName(e.target.value)}
              className="mb-4 p-2 w-full border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Widget Text"
              value={widgetText}
              onChange={(e) => setWidgetText(e.target.value)}
              className="mb-4 p-2 w-full border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Widget
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
