import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle2, AlertCircle, Info, Trash2 } from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      type: "success",
      title: "Escrow Released",
      message: "Your escrow for 'Laptop Purchase' has been released. Funds transferred to your wallet.",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "n2",
      type: "info",
      title: "Payment Received",
      message: "You received USD $250 from Alice Developer for freelance work.",
      timestamp: "1 day ago",
      read: false,
    },
    {
      id: "n3",
      type: "warning",
      title: "Escrow Dispute",
      message: "A dispute has been opened on your escrow 'Camera Equipment'. Please review the details.",
      timestamp: "3 days ago",
      read: true,
    },
    {
      id: "n4",
      type: "success",
      title: "Escrow Funded",
      message: "Your escrow for 'Freelance Project' has been funded by the buyer.",
      timestamp: "5 days ago",
      read: true,
    },
    {
      id: "n5",
      type: "info",
      title: "New Feature Available",
      message: "Check out our new Crypto Market page to track real-time cryptocurrency prices.",
      timestamp: "1 week ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card
      className={`p-6 hover:border-primary/40 transition-colors ${
        !notification.read ? "bg-primary/5 border-primary/20" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="mt-1">{getIcon(notification.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold">{notification.title}</p>
              {!notification.read && (
                <Badge variant="default" className="text-xs">
                  New
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAsRead(notification.id)}
            >
              Mark Read
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteNotification(notification.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-2">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>

          {/* All Notifications */}
          <TabsContent value="all" className="space-y-4 mt-6">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No notifications</p>
              </Card>
            )}
          </TabsContent>

          {/* Unread Notifications */}
          <TabsContent value="unread" className="space-y-4 mt-6">
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">All caught up!</p>
              </Card>
            )}
          </TabsContent>

          {/* Read Notifications */}
          <TabsContent value="read" className="space-y-4 mt-6">
            {readNotifications.length > 0 ? (
              readNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No read notifications</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
