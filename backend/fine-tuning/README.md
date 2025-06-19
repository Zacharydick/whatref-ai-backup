# 🕰️ Watch Identification Fine-Tuning Guide

This guide will help you fine-tune OpenAI's GPT-4o model specifically for watch identification, dramatically improving accuracy for reference numbers and specifications.

## 📋 Overview

**What you'll achieve:**
- Custom model specialized for luxury watch identification
- Significantly improved reference number accuracy
- Domain-specific knowledge of watch brands and models
- Faster response times and lower costs

**Investment required:**
- **Time**: 2-4 weeks for data collection + 1-2 days for training
- **Cost**: ~$25-100 for training (depending on dataset size)
- **Data**: 500-5000 verified watch images with specifications

---

## 🚀 Quick Start

### 1. **Prepare Your Environment**

```bash
cd backend/fine-tuning
pip install openai pandas requests
export OPENAI_API_KEY="your-api-key-here"
```

### 2. **Collect Watch Data**

Create a CSV file with this format:
```csv
image_path,reference_number,brand,model,case_size,year,material
https://example.com/rolex-sub.jpg,116610LN,Rolex,Submariner,40mm,2010-2020,Stainless Steel
```

**Data Sources:**
- Authorized dealer websites
- Auction house catalogs (Christie's, Sotheby's)
- Marketplace listings (verified sellers only)
- Brand official websites
- Watch forums (verified members)

### 3. **Prepare Training Dataset**

```python
from prepare_dataset import WatchDatasetPreparer

# Load your data
preparer = WatchDatasetPreparer()
preparer.load_from_csv('your_watch_data.csv')

# Validate and save
if preparer.validate_dataset():
    preparer.save_jsonl('watch_training_data.jsonl')
```

### 4. **Start Fine-Tuning**

```python
python finetune_watch_model.py
```

Follow the prompts to upload your dataset and monitor progress.

---

## 📊 Dataset Requirements

### **Minimum Dataset Specs**

| Metric | Minimum | Recommended | Optimal |
|--------|---------|-------------|---------|
| **Total Images** | 500 | 1,000 | 5,000+ |
| **Brands Covered** | 5 | 10 | 20+ |
| **Images per Brand** | 50 | 100 | 250+ |
| **Image Quality** | 1024px+ | 1920px+ | 4K |

### **Coverage Goals**

**Top Priority Brands:**
- Rolex (20% of dataset)
- Omega (15% of dataset)
- Patek Philippe (10% of dataset)
- Audemars Piguet (10% of dataset)
- Tudor (10% of dataset)

**Image Angles Needed:**
- Dial view (70%)
- Side profile (15%)
- Caseback (10%)
- Crown/pushers (5%)

### **Data Quality Checklist**

✅ **Image Requirements:**
- High resolution (1024px minimum)
- Clear, well-lit photos
- Minimal reflections/shadows
- Watch face clearly visible
- Brand name readable

✅ **Accuracy Requirements:**
- Reference numbers verified from multiple sources
- Specifications cross-checked with official documentation
- No vintage/modified pieces (unless specifically labeled)
- Consistent formatting across all entries

---

## 💰 Cost Analysis

### **OpenAI Fine-Tuning Costs**

```
Base Model: gpt-4o-2024-08-06
Training: $25 per 1M tokens
Inference: $3.75 per 1M input tokens, $15 per 1M output tokens

Example for 1,000 images:
- Training cost: ~$50-75
- Monthly inference (10,000 requests): ~$100-150
```

### **Data Collection Costs**

- **Option A**: Manual collection (Free, ~40 hours)
- **Option B**: Freelancer/VA ($500-1500)
- **Option C**: Professional annotation service ($2000-5000)

---

## 🔧 Technical Implementation

### **Integration with Your App**

Once fine-tuning is complete, update your backend:

```javascript
// In backend/src/index.js
const response = await openai.chat.completions.create({
  model: "ft:gpt-4o-2024-08-06:your-org::model-id", // Your fine-tuned model
  messages: [
    {
      role: "system",
      content: "You are an expert watch identifier specializing in luxury timepieces and reference numbers."
    },
    {
      role: "user",
      content: "Identify this watch and provide its reference number and specifications."
    },
    {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: { url: dataUrl }
        }
      ]
    }
  ],
  max_tokens: 200
});
```

### **Performance Monitoring**

Track these metrics:
- **Reference number accuracy**: % of correct ref numbers
- **Brand identification**: % correct brand detection
- **Response consistency**: Variations in multiple requests
- **User satisfaction**: Feedback from actual users

---

## 📈 Expected Results

### **Before Fine-Tuning (Current State)**
- Reference number accuracy: ~30-50%
- Often says "Not identifiable"
- Generic watch descriptions
- Inconsistent formatting

### **After Fine-Tuning (Expected)**
- Reference number accuracy: ~80-95%
- Confident, specific identifications
- Detailed, accurate specifications
- Consistent response format

### **Real-World Examples**

**Grab** (ride-sharing): 20% improvement in accuracy with just 100 images
**Automat** (RPA): 272% improvement in identification tasks
**Coframe** (web design): 26% improvement in visual consistency

---

## 🚨 Important Considerations

### **Legal & Ethical**
- Ensure you have rights to use all training images
- Respect copyright and trademark laws
- Consider watermarked images from auction houses
- Document data sources for transparency

### **Quality Control**
- Start with a small, high-quality dataset (500 images)
- Test extensively before scaling up
- Validate against known watches regularly
- Monitor for model drift over time

### **Business Impact**
- Fine-tuning takes 1-4 hours typically
- Model deployment requires code updates
- Consider fallback to base model if needed
- Plan for periodic retraining (every 6-12 months)

---

## 🎯 Next Steps

1. **Week 1-2**: Collect and verify 500 high-quality watch images
2. **Week 3**: Prepare dataset using provided scripts
3. **Week 4**: Run fine-tuning and evaluate results
4. **Deploy**: Update your app with the new model

**Need help?** This is a complex process that requires significant data collection effort. Consider starting with a smaller pilot program to validate the approach before investing in a full dataset.

---

## 📞 Support

For questions about this fine-tuning process:
- Check OpenAI's fine-tuning documentation
- Review the provided scripts and examples
- Test with small datasets first
- Monitor costs carefully during development

**Remember**: Fine-tuning is an investment in accuracy, but requires significant upfront effort in data collection and validation. 