import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";

interface HealthMetricsProps {
  metrics: {
    timestamp?: string;
    is_connected?: boolean;
    contract_accessible?: boolean;
    account_balance?: string;
    transaction_count?: number;
    successful_transactions?: number;
    failed_transactions?: number;
    transaction_success_rate?: string;
    temperature_breaches?: number;
    critical_breaches?: number;
    warning_breaches?: number;
    batches_created?: number;
    batches_completed?: number;
  };
  onRefresh?: () => void;
  onReset?: () => void;
}

const HealthMetrics: React.FC<HealthMetricsProps> = ({
  metrics,
  onRefresh,
  onReset,
}) => {
  const formatDate = (timestamp?: string) => {
    if (!timestamp) return "Unknown";
    try {
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>System Health</CardTitle>
        <div className="space-x-2">
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset}>
              Reset Counters
            </Button>
          )}
          {onRefresh && (
            <Button size="sm" onClick={onRefresh}>
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Connection Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connection Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">
                  Blockchain Connected:
                </span>
                <span
                  className={`text-sm ${
                    metrics.is_connected ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metrics.is_connected ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">
                  Contract Accessible:
                </span>
                <span
                  className={`text-sm ${
                    metrics.contract_accessible
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {metrics.contract_accessible ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Account Balance:</span>
                <span className="text-sm">
                  {metrics.account_balance
                    ? metrics.account_balance
                    : "Unknown"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Last Updated:</span>
                <span className="text-sm">{formatDate(metrics.timestamp)}</span>
              </div>
            </div>
          </div>

          {/* Transaction Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Transaction Metrics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Transactions:</span>
                <span className="text-sm">
                  {metrics.transaction_count || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Successful:</span>
                <span className="text-sm text-green-600">
                  {metrics.successful_transactions || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Failed:</span>
                <span className="text-sm text-red-600">
                  {metrics.failed_transactions || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Success Rate:</span>
                <span className="text-sm font-semibold">
                  {metrics.transaction_success_rate || "0%"}
                </span>
              </div>
            </div>
          </div>

          {/* Temperature Breach Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Temperature Metrics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Breaches:</span>
                <span className="text-sm">
                  {metrics.temperature_breaches || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Critical Breaches:</span>
                <span className="text-sm text-red-600">
                  {metrics.critical_breaches || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Warning Breaches:</span>
                <span className="text-sm text-yellow-600">
                  {metrics.warning_breaches || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Batch Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Batch Metrics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Batches Created:</span>
                <span className="text-sm">{metrics.batches_created || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Batches Completed:</span>
                <span className="text-sm">
                  {metrics.batches_completed || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Completion Rate:</span>
                <span className="text-sm">
                  {metrics.batches_created
                    ? `${(
                        ((metrics.batches_completed || 0) /
                          metrics.batches_created) *
                        100
                      ).toFixed(1)}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthMetrics;
