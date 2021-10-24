# CDF
<!-- # Guy Golpur 24/10/2021- KPMG -->

CDF plugin for Kibana 7.12.0

---

## Development

See the [kibana contributing guide](https://github.com/elastic/kibana/blob/master/CONTRIBUTING.md) for instructions setting up your development environment.

## Scripts

<dl>
  <dd>Install Git bash to your machine.</dd>
  <dd>Install the version of Node.js listed in the .node-version file.</dd>
  <dd>Clone the kibana repo, change directory into it, and then checkout to 7.12 branch.</dd>
  <dt><code>git clone https://github.com/[YOUR_USERNAME]/kibana.git kibana</code></dt>
  <dt><code>cd kibana</code></dt>
  <dt><code>git checkout 7.12</code></dt>

  <dd>Install the lastest version of yarn v1.</dd>

  <dd>Bootstrap Kibana and install all the dependencies:</dd>
  <dt><code>yarn kbn bootstrap</code></dt>
  <dd>Execute this to install node_modules and setup the dependencies in your plugin and in Kibana</dd>

  <dt><code>yarn plugin-helpers build</code></dt>
  <dd>Execute this to create a distributable version of this plugin that can be installed in Kibana</dd>
</dl>
