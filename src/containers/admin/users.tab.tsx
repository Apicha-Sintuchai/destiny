import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getUsersAction, getUsersCountAction } from "@/actions/admin/admin.actions";
import { ChevronLeft, ChevronRight, Eye, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Subscription = {
    id: string;
    status: "ACTIVE" | "EXPIRED";
    startAt: Date;
    expiryAt: Date;
};

type User = {
    id: string;
    phoneNumber: string;
    firstname: string;
    lastname: string;
    birthday: Date;
    credit: number;
    experience: number;
    role: "ADMIN" | "VIP" | "MEMBER";
    createdAt: Date;
    updatedAt: Date;
    Subscription: Subscription[] | null;
};

export const AdminUserTab = () => {
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [users, setUsers] = useState<User[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const skip = (currentPage - 1) * itemsPerPage;
            const [usersResult, countResult] = await Promise.all([
                getUsersAction(itemsPerPage, skip),
                getUsersCountAction(),
            ]);

            if (!usersResult.success) {
                setError(usersResult.error || "Failed to fetch users");
                return;
            }

            if (!countResult.success) {
                setError(countResult.error || "Failed to fetch users count");
                return;
            }

            setUsers(usersResult.data || []);
            setTotalCount(countResult.data || 0);
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const handleDeleteUser = (userId: string) => {
        setUsers(users.filter((user) => user.id !== userId));
        setTotalCount((prev) => prev - 1);
        setDeleteUserId(null);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "destructive";
            case "VIP":
                return "default";
            default:
                return "secondary";
        }
    };

    const getSubscriptionBadgeVariant = (status: string) => {
        return status === "ACTIVE" ? "default" : "secondary";
    };

    const getActiveSubscription = (subscriptions: Subscription[] | null) => {
        if (!subscriptions || subscriptions.length === 0) return null;
        return subscriptions[0];
    };

    return (
        <React.Fragment>
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>Manage your platform users</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-md">
                            {error}
                        </div>
                    )}

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone Number</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Subscription</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        Loading users...
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => {
                                    const subscription = getActiveSubscription(user.Subscription);
                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.firstname} {user.lastname}
                                            </TableCell>
                                            <TableCell>{user.phoneNumber}</TableCell>
                                            <TableCell>
                                                <Badge variant={getRoleBadgeVariant(user.role)}>
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {subscription ? (
                                                    <Badge
                                                        variant={getSubscriptionBadgeVariant(
                                                            subscription.status,
                                                        )}
                                                    >
                                                        {subscription.status}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">
                                                        No subscription
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setSelectedUser(user)}
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    >
                                                        <Eye size={18} />
                                                    </Button>
                                                    <Button
                                                        disabled
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeleteUserId(user.id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>

                    {!loading && totalPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {startIndex + 1} to {endIndex} of {totalCount} users
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <div className="text-sm font-medium">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User Details Modal */}
            <Dialog open={selectedUser !== null} onOpenChange={() => setSelectedUser(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>
                            Complete information about the selected user
                        </DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="space-y-4">
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Basic Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Full Name</p>
                                        <p className="font-medium">
                                            {selectedUser.firstname} {selectedUser.lastname}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Phone Number
                                        </p>
                                        <p className="font-medium">{selectedUser.phoneNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Birthday</p>
                                        <p className="font-medium">
                                            {new Date(selectedUser.birthday).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Role</p>
                                        <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                                            {selectedUser.role}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Game Statistics */}
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Game Statistics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Credit</p>
                                        <p className="font-medium text-lg">
                                            {selectedUser.credit.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Experience</p>
                                        <p className="font-medium text-lg">
                                            {selectedUser.experience.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Subscription Information */}
                            <div>
                                <h3 className="text-sm font-semibold mb-2">
                                    Subscription Information
                                </h3>
                                {(() => {
                                    const subscription = getActiveSubscription(
                                        selectedUser.Subscription,
                                    );
                                    return subscription ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Status
                                                </p>
                                                <Badge
                                                    variant={getSubscriptionBadgeVariant(
                                                        subscription.status,
                                                    )}
                                                >
                                                    {subscription.status}
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Start Date
                                                </p>
                                                <p className="font-medium">
                                                    {new Date(
                                                        subscription.startAt,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Expiry Date
                                                </p>
                                                <p className="font-medium">
                                                    {new Date(
                                                        subscription.expiryAt,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No active subscription
                                        </p>
                                    );
                                })()}
                            </div>

                            <Separator />

                            {/* Account Information */}
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Account Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">User ID</p>
                                        <p className="font-mono text-xs">{selectedUser.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Created At</p>
                                        <p className="font-medium">
                                            {new Date(selectedUser.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Last Updated
                                        </p>
                                        <p className="font-medium">
                                            {new Date(selectedUser.updatedAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteUserId !== null} onOpenChange={() => setDeleteUserId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user
                            account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </React.Fragment>
    );
};
