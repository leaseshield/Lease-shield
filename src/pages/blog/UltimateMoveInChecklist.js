import React from 'react';
import { Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BlogPostLayout from './BlogPostLayout';

const UltimateMoveInChecklist = () => {
  const title = 'The Ultimate Move-In Checklist: How to Document Your Rental and Protect Your Deposit';
  const description = 'Protect your security deposit with a thorough, AI-assisted move-in checklist. Photos, tests, and a time-stamped report.';

  return (
    <BlogPostLayout title={title} description={description}>
      <Typography variant="body1" paragraph>
        The day you get the keys to your new rental is filled with excitement. But amidst the chaos of unpacking boxes, there's one crucial step that renters often overlook: thoroughly documenting the property's condition. This single task can be the difference between getting your full security deposit back and losing hundreds, or even thousands, of dollars to unfair damage claims.
      </Typography>
      <Typography variant="body1" paragraph>
        Disputes over security deposits are one of the most common issues between landlords and tenants. The best way to protect yourself is with undeniable proof. That’s where a digital-first approach, powered by tools like Lease Shield AI’s Photo Inspector, can be your greatest asset.
      </Typography>

      <Typography variant="h2" gutterBottom>Why Your Smartphone is Your Best Friend</Typography>
      <Typography variant="body1" paragraph>
        Before you move a single piece of furniture, walk through every room and document everything.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Take More Photos & Videos Than You Think You Need:</strong> Don't just snap a picture of the whole room. Get close-ups of any existing damage: scuffs on the wall, stains on the carpet, scratches on the floor, chips in the countertop. A video walkthrough with you narrating the issues is even better.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Test Everything:</strong> Turn on all the faucets and check for leaks. Flush the toilets. Test every electrical outlet. Turn on all the appliances (stove, oven, dishwasher, microwave) to ensure they work. Document anything that is broken or not functioning properly.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Don't Forget the Details:</strong> Check window screens for tears, test the locks on doors and windows, and look inside cabinets and closets for any damage.
      </Typography>

      <Typography variant="h2" gutterBottom>The Problem with Traditional Checklists</Typography>
      <Typography variant="body1" paragraph>
        A paper checklist is good, but it’s not foolproof. It’s subjective and lacks visual evidence. A landlord can easily dispute your handwritten note that a "small stain" was on the carpet. It's much harder for them to dispute a time-stamped, high-resolution photograph.
      </Typography>

      <Typography variant="h2" gutterBottom>Upgrade Your Documentation with AI</Typography>
      <Typography variant="body1" paragraph>
        This is where technology can give you an edge. With the Photo Inspector module, you can create an ironclad digital record of your move-in inspection.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Upload Your Photos:</strong> Easily upload all the photos and videos you took during your walkthrough to a secure, centralized location.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Instant, Annotated Reports:</strong> Our AI can help analyze the photos to detect and label potential issues, creating a professional, annotated report.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Create a Time-Stamped Record:</strong> You now have a comprehensive, time-stamped digital record of the property’s condition on the day you moved in. This report can be shared with your landlord to get everyone on the same page from day one.
      </Typography>
      <Typography variant="body1" paragraph>
        When it's time to move out, you can repeat the process. By comparing the move-in and move-out reports, you can clearly demonstrate that any new damage is just "normal wear and tear," not something that should be deducted from your deposit.
      </Typography>

      <Typography variant="h2" gutterBottom>Your Move-In To-Do List:</Typography>
      <List>
        <ListItem><ListItemText primary="Schedule a walkthrough before moving furniture." /></ListItem>
        <ListItem><ListItemText primary="Take detailed photos and videos of every room and any existing damage." /></ListItem>
        <ListItem><ListItemText primary="Test all appliances, outlets, and fixtures." /></ListItem>
        <ListItem><ListItemText primary="Use the Photo Inspector to create a digital, time-stamped report." /></ListItem>
        <ListItem><ListItemText primary="Send a copy of the report to your landlord via email to create a paper trail." /></ListItem>
      </List>

      <Box sx={{ my: 3 }}>
        <Button variant="contained" color="primary" component={RouterLink} to="/photo-inspection">
          Learn More About Photo Inspector
        </Button>
      </Box>

      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
        #RenterTips #SecurityDeposit #MoveInChecklist #FirstApartment #RentalTips #PropTech #LeaseShieldAI #ProtectYourMoney #ApartmentLiving
      </Typography>
    </BlogPostLayout>
  );
};

export default UltimateMoveInChecklist;


