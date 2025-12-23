import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Plus, Gift, Check, X, Coins } from 'lucide-react';
import type { Role, Wish } from '../App';

interface WishPanelProps {
  role: Role;
  wishes: Wish[];
  childPoints: number;
  onAddWish?: (wish: Omit<Wish, 'id' | 'status'>) => void;
  onWishApprove?: (wishId: string) => void;
  onWishReject?: (wishId: string) => void;
  onRedeemWish?: (wishId: string) => void;
  onBackToHome?: () => void;
  onBackToTasks?: () => void;
}

export function WishPanel({
  role,
  wishes,
  childPoints,
  onAddWish,
  onWishApprove,
  onWishReject,
  onRedeemWish,
  onBackToHome,
  onBackToTasks,
}: WishPanelProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newWish, setNewWish] = useState({
    title: '',
    pointCost: 100,
  });

  const handleAddWish = () => {
    if (newWish.title && onAddWish) {
      onAddWish(newWish);
      setNewWish({
        title: '',
        pointCost: 100,
      });
      setIsAddDialogOpen(false);
    }
  };

  const getRoleColor = () => {
    if (role === 'child') return 'pink';
    if (role === 'parent') return 'blue';
    return 'green';
  };

  const roleColor = getRoleColor();

  // Filter wishes based on role
  const displayWishes = role === 'child'
    ? wishes.filter(w => w.status === 'approved')
    : wishes.filter(w => w.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBackToHome || onBackToTasks}
            className={`text-${roleColor}-600`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {role === 'child' ? 'Back to Dashboard' : 'Back to Tasks'}
          </Button>

          {role === 'child' && (
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-800">{childPoints} points</span>
            </div>
          )}
        </div>

        <div className="text-center mb-8">
          <h1 className={`text-${roleColor}-600 mb-2`}>
            {role === 'child' ? 'My Wishes' : 'Wish Management'}
          </h1>
          <p className="text-gray-600">
            {role === 'child'
              ? 'Add wishes and redeem them with your points!'
              : 'Review and approve wishes from children'}
          </p>
        </div>

        {/* Add Wish Button for Child */}
        {role === 'child' && onAddWish && (
          <div className="mb-6">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className={`bg-${roleColor}-600 hover:bg-${roleColor}-700`}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Wish
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Wish</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="wishTitle">What do you wish for?</Label>
                    <Input
                      id="wishTitle"
                      value={newWish.title}
                      onChange={(e) => setNewWish({ ...newWish, title: e.target.value })}
                      placeholder="e.g., New video game, Trip to the zoo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pointCost">Point Cost</Label>
                    <Input
                      id="pointCost"
                      type="number"
                      value={newWish.pointCost}
                      onChange={(e) => setNewWish({ ...newWish, pointCost: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <Button
                    onClick={handleAddWish}
                    className={`w-full bg-${roleColor}-600 hover:bg-${roleColor}-700`}
                  >
                    Add Wish
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Wish List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayWishes.length === 0 ? (
            <Card className="p-8 text-center bg-white col-span-full">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {role === 'child'
                  ? 'No approved wishes yet. Add a wish and wait for approval!'
                  : 'No pending wishes to review'}
              </p>
            </Card>
          ) : (
            displayWishes.map((wish) => (
              <Card key={wish.id} className="p-6 bg-white hover:shadow-lg transition-shadow">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-gray-800 mb-2">{wish.title}</h3>
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span className={`text-${roleColor}-600`}>
                          {wish.pointCost} points
                        </span>
                      </div>
                    </div>
                    <Gift className={`w-8 h-8 text-${roleColor}-400`} />
                  </div>

                  {/* Status Badge */}
                  {wish.status === 'pending' && (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-700 mb-4 w-fit">
                      Pending Approval
                    </Badge>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-auto">
                    {role === 'child' && wish.status === 'approved' && onRedeemWish && (
                      <Button
                        onClick={() => onRedeemWish(wish.id)}
                        disabled={childPoints < wish.pointCost}
                        className={`w-full ${
                          childPoints >= wish.pointCost
                            ? `bg-${roleColor}-600 hover:bg-${roleColor}-700`
                            : 'bg-gray-300'
                        }`}
                      >
                        {childPoints >= wish.pointCost
                          ? 'Redeem Now'
                          : `Need ${wish.pointCost - childPoints} more points`}
                      </Button>
                    )}

                    {(role === 'parent' || role === 'teacher') && wish.status === 'pending' && (
                      <div className="flex gap-2">
                        {onWishApprove && (
                          <Button
                            onClick={() => onWishApprove(wish.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        )}
                        {onWishReject && (
                          <Button
                            onClick={() => onWishReject(wish.id)}
                            variant="outline"
                            className="flex-1 border-red-400 text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Info Card for Parents */}
        {(role === 'parent' || role === 'teacher') && (
          <Card className="p-6 bg-blue-50 border-blue-200 mt-8">
            <h3 className="text-blue-800 mb-2">Wish Management Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Review each wish carefully before approving</li>
              <li>Ensure the point cost is reasonable for the wish</li>
              <li>Approved wishes become available for children to redeem</li>
              <li>Children can only see and redeem approved wishes</li>
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
