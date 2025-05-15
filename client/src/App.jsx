import FollowList from './pages/profileSection/FollowList';

// In your router configuration:
<Routes>
  {/* ... existing routes ... */}
  <Route path="/profile/:userId/:type" element={<FollowList />} />
</Routes>
// ... existing code ... 