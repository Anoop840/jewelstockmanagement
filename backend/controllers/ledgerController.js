import Ledger from '../models/Ledger.js';
import Product from '../models/Product.js';
import Seller from '../models/Seller.js';

// @desc    Issue stock items to a seller (Consignment Handover)
// @route   POST /api/ledger/issue
export const issueStock = async (req, res) => {
  try {
    const { sellerId, items, notes } = req.body; 
    // items array format: [{ productId, variantSku, quantity }]

    // 1. Verify if the seller exists
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const processedItems = [];
    let totalIssuedPieces = 0;

    // 2. Loop through each item being handed over to check and update vault stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      // Find the specific color variant (e.g., GG101-GOLD)
      const variant = product.variants.find(v => v.sku === item.variantSku);
      if (!variant) {
        return res.status(404).json({ message: `Variant SKU ${item.variantSku} not found` });
      }

      // Check if the store actually has enough pieces in the main vault
      if (variant.stockInHouse < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${item.variantSku}. Available: ${variant.stockInHouse}, Requested: ${item.quantity}` 
        });
      }

      // Deduct from main vault stock
      variant.stockInHouse -= item.quantity;
      await product.save();

      // Track data for the ledger document
      processedItems.push({
        product: item.productId,
        variantSku: item.variantSku,
        quantityIssued: item.quantity,
        quantityPending: item.quantity // Initially, all pieces are outstanding
      });

      totalIssuedPieces += item.quantity;
    }

    // 3. Create the Ledger Journal Entry
    const ledgerEntry = new Ledger({
      seller: sellerId,
      items: processedItems,
      notes,
      status: 'Pending'
    });
    const savedLedger = await ledgerEntry.save();

    // 4. Update the Seller's overall outstanding counter
    seller.outstandingPieces += totalIssuedPieces;
    await seller.save();

    res.status(201).json(savedLedger);

  } catch (error) {
    res.status(500).json({ message: 'Server Error issuing stock', error: error.message });
  }
};

// @desc    Reconcile / Audit seller stock (Process Sold, Retained, and Returned items)
// @route   POST /api/ledger/reconcile/:ledgerId
export const reconcileStock = async (req, res) => {
  try {
    const { ledgerId } = req.params;
    const { reconciliations } = req.body; 
    // reconciliations format: [{ variantSku, sold, returned, kept }]

    const ledger = await Ledger.findById(ledgerId);
    if (!ledger) {
      return res.status(404).json({ message: 'Ledger record not found' });
    }

    const seller = await Seller.findById(ledger.seller);
    let totalPiecesReducedFromSeller = 0;

    // Process each variant audit submitted by the manager
    for (const audit of reconciliations) {
      const item = ledger.items.find(i => i.variantSku === audit.variantSku);
      if (!item) {
        return res.status(404).json({ message: `Item SKU ${audit.variantSku} not found in this ledger entry` });
      }

      // Mathematical Validation: Ensure input matches the current outstanding balance
      // e.g., 6 (sold) + 1 (returned) + 5 (kept) must equal 12 (currently pending)
      const inputTotal = audit.sold + audit.returned + audit.kept;
      if (inputTotal !== item.quantityPending) {
        return res.status(400).json({ 
          message: `Math mismatch for SKU ${audit.variantSku}. You submitted a total of ${inputTotal} pieces, but current pending balance is ${item.quantityPending}` 
        });
      }

      // Update ledger values
      item.quantitySold += audit.sold;
      item.quantityReturned += audit.returned;
      item.quantityPending = audit.kept; // The "kept" amount becomes the new outstanding balance

      // Track pieces that are no longer the seller's responsibility (Sold + Returned)
      totalPiecesReducedFromSeller += (audit.sold + audit.returned);

      // If pieces were physically returned to the manager, put them back into the main vault
      if (audit.returned > 0) {
        const product = await Product.findById(item.product);
        const variant = product.variants.find(v => v.sku === audit.variantSku);
        variant.stockInHouse += audit.returned;
        await product.save();
      }
    }

    // Determine the overall status of this ledger entry
    const completelySettled = ledger.items.every(i => i.quantityPending === 0);
    if (completelySettled) {
      ledger.status = 'Fully Settled';
    } else {
      ledger.status = 'Partially Settled';
    }

    await ledger.save();

    // Update Seller metrics
    seller.outstandingPieces -= totalPiecesReducedFromSeller;
    await seller.save();

    res.status(200).json({ message: 'Reconciliation successful', ledger });

  } catch (error) {
    res.status(500).json({ message: 'Server Error during reconciliation', error: error.message });
  }
};