import React from "react";

interface Transaction {
  transaction_hash?: string;
  transaction_url?: string;
  success?: boolean;
  gas_used?: number;
  execution_time?: number;
  error?: string;
}

interface TransactionStatusProps {
  transaction: Transaction | null;
  isLoading?: boolean;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({
  transaction,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="p-4 border rounded-md bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          <span className="text-gray-600">Transaction in progress...</span>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return null;
  }

  if (transaction.error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <h4 className="font-medium text-red-700">Transaction Failed</h4>
        <p className="text-sm text-red-600 mt-1">{transaction.error}</p>
      </div>
    );
  }

  return (
    <div
      className={`p-4 border rounded-md ${
        transaction.success
          ? "border-green-200 bg-green-50"
          : "border-red-200 bg-red-50"
      }`}
    >
      <h4
        className={`font-medium ${
          transaction.success ? "text-green-700" : "text-red-700"
        }`}
      >
        Transaction {transaction.success ? "Successful" : "Failed"}
      </h4>

      <div className="mt-2 space-y-1">
        {transaction.transaction_hash && (
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Transaction Hash:</span>
            <div className="flex">
              <code className="text-xs overflow-hidden overflow-ellipsis">
                {transaction.transaction_hash}
              </code>
              {transaction.transaction_url && (
                <a
                  href={transaction.transaction_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  View on Explorer
                </a>
              )}
            </div>
          </div>
        )}

        {transaction.gas_used !== undefined && (
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Gas Used:</span>
            <span className="text-xs">
              {transaction.gas_used.toLocaleString()}
            </span>
          </div>
        )}

        {transaction.execution_time !== undefined && (
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Execution Time:</span>
            <span className="text-xs">
              {transaction.execution_time.toFixed(2)}s
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionStatus;
