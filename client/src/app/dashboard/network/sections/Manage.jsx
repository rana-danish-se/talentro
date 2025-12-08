"use client";
import React, { useEffect } from "react";
import { Users, Users2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNetwork } from "../../../../lib/Network";

const ManageNetwork = ({ networkStats }) => {
  const { totalConnections, fetchTotalConnections } = useNetwork();

  useEffect(() => {
    fetchTotalConnections();
  }, [fetchTotalConnections]);

  const menuItems = [
    {
      icon: Users,
      label: "Connections",
      count: totalConnections,
      path: "/dashboard/network/connections",
    },
    {
      icon: Users2,
      label: "Groups",
      count: networkStats?.groups || 17,
      path: "/mynetwork/groups",
    },
  ];

  return (
    <div className="w-full  max-w-sm mt-10">
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-4 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Manage my network
          </h2>
        </div>

        {/* Menu Items */}
        <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={index}
                href={item.path}
                whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.05)" }}
                className="flex items-center justify-between px-4 py-4 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-neutral-600 dark:text-neutral-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                  <span className="text-base font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.count !== null && (
                    <span className="text-base font-semibold text-neutral-600 dark:text-neutral-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {item.count.toLocaleString()}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors opacity-0 group-hover:opacity-100" />
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ManageNetwork;
