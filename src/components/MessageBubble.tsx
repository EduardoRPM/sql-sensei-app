import { Message } from "@/types/chat";
import { formatTime } from "@/utils/dateUtils";

interface MessageBubbleProps {
  message: Message;
}

// Tabla sencilla y responsive para resultados de SQL:
const ResultTable = ({ data }: { data: any[] }) => {
  if (!data.length) return null;
  const headers = Object.keys(data[0]);
  return (
    <div className="overflow-x-auto mt-2">
      <table className="min-w-full border text-xs rounded">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-2 py-1 border font-semibold bg-gray-50"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="even:bg-gray-50">
              {headers.map((h) => (
                <td key={h} className="px-2 py-1 border">
                  {row[h]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const MessageBubble = ({ message }: MessageBubbleProps) => (
  <div
    className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in`}
  >
    <div
      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${message.isUser
        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto"
        : "bg-white text-gray-800 border border-gray-200"
        }`}
    >
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {message.content}
      </div>
      {Array.isArray(message.data) && message.data.length > 0 && (
        <ResultTable
          data={message.data.map((row) =>
            Object.fromEntries(
              Object.entries(row).map(([k, v]) =>
                typeof v === "string" ? [k, v.trim()] : [k, v]
              )
            )
          )}
        />
      )}
      <div
        className={`text-xs mt-2 ${message.isUser ? "text-blue-100" : "text-gray-500"
          }`}
      >
        {formatTime(message.timestamp)}
      </div>
    </div>
  </div>
);






/* 
import { Message } from "@/types/chat";
import { formatTime } from "@/utils/dateUtils";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div
      className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
          message.isUser
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto"
            : "bg-white text-gray-800 border border-gray-200"
        }`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
        <div
          className={`text-xs mt-2 ${
            message.isUser ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};
 */