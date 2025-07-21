export const isAdmin = (req, res, next) => {
    // console.log(req.authUser);
    
  if (!req.authUser || req.authUser.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};