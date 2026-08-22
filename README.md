🌒 DARKTRACER – Dark Web Threat Intelligence System

DARKTRACER is an AI-powered "Dark Web Threat Detection and Analysis System" built in Java that helps organizations detect, classify, and visualize sensitive data leaks from the dark web. It combines web crawling, NLP, and real-time alerting to track stolen credentials, exposed emails, and confidential data posted on dark web marketplaces and forums.

Key Features

  Dark Web Crawling: Uses Selenium with Tor to collect text and metadata from hidden `.onion` sites.

  API Bridge (Postman Tested): REST APIs built with Spring Boot, connecting crawler → NLP → dashboard modules.

  Text Preprocessing: Cleans and normalizes dark web data for ML processing (tokenization, stopword removal, normalization).

  Leak Classification (AI Models): Uses BERT/RoBERTa(via Hugging Face / ONNX Runtime) to identify leak types — password, email, credit card, or sensitive info.

  Named Entity Recognition (NER): Extracts entities like usernames, domains, and emails using Stanford NLP or Deep Java Library (DJL).

  Classbase Storage: Internal MySQL database to store classified leaks and detected entities for threat intelligence tracking.

  Alert Engine: Automatically generates alerts when high-risk leaks are found (e.g., government emails, credit card data).

  Dashboard Visualization: Built with React.js and Chart.js for interactive visualization — users can view source links, entity types, leak severity, and time trends.

  Goal

  DARKTRACER helps cybersecurity analysts detect dark web leaks early, analyze threat patterns, and protect sensitive information before exploitation occurs.
