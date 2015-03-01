<?php
namespace Webiny\Platform\Builders\Dom;

class Selector
{

    function select($source, $query)
    {
        // disable libxml errors because it doesn't support html5 tags
        libxml_use_internal_errors(true);

        // first we need to extract all the layouts and blocks
        $doc = new \DOMDocument();
        $doc->preserveWhiteSpace = true;
        $doc->formatOutput = false;
        $doc->substituteEntities = false;
        // loadHtml messes up the format
        // loadXml messes up when we have a doc-tag in the html
        $doc->loadXml($source, LIBXML_NOWARNING || LIBXML_NONET);
        libxml_clear_errors();
        $xpath = new \DOMXpath($doc);
        $xResult = $xpath->query($query);
        if($xResult->length<1){
            $doc->loadHTML($source, LIBXML_NOWARNING || LIBXML_NONET);
            $doc->preserveWhiteSpace = true;
            $doc->formatOutput = false;
            $doc->substituteEntities = false;
            libxml_clear_errors();
            $xpath = new \DOMXpath($doc);
            $xResult = $xpath->query($query);
        }

        $result = [];
        foreach ($xResult as $r) {
            $entry = [];

            // extract blocks
            $entry['tag'] = $r->tagName;

            $innerHtml = '';
            $children = $r->childNodes;
            foreach ($children as $child) {
                $innerHtml .= $child->ownerDocument->saveXml($child);
            }
            $entry['content'] = $innerHtml;

            $xAttributes = $r->attributes;
            foreach ($xAttributes as $a) {
                $entry['attributes'][$a->name] = $a->value;
            }


            $entry['outerHtml'] = $r->ownerDocument->saveXml($r);
            $result[] = $entry;
        }

        return $result;
    }

    function replace($source, $query, $replacement)
    {
        // disable libxml errors because it doesn't support html5 tags
        /*libxml_use_internal_errors(true);

        $doc = new \DOMDocument();
        $doc->preserveWhiteSpace = true;
        $doc->formatOutput = false;
        $doc->loadHTML($source, LIBXML_NOWARNING || LIBXML_NONET);
        libxml_clear_errors();

        $xpath = new \DOMXpath($doc);
        $results = $xpath->query($query);
        $item = $results->item(0);*/

        $result = self::select($source, $query);
        
        /*if ($query == "//w-layout[@template='layouts/2col.htpl']") {
            die(print_r($result[0]['outerHtml']));
        }*/

        if (!isset($result[0])) {
            return $source;
        }

        $replacement = str_replace(['  ', "\n", "\t"], [' ', ' ', ' '], $replacement);
        $search = str_replace(['  ', "\n", "\t", "\r\r"], [' ', ' ', ' ', ' '], $result[0]['outerHtml']);
        $search = preg_replace('/\s+/', ' ',$search);
        $search = str_replace('> <', '><', $search);
        $source = str_replace(['  ', "\n", "\t", "\r\r"], [' ', ' ', ' ', ' '], $source);
        $source = preg_replace('/\s+/', ' ',$source);
        $source = str_replace('> <', '><', $source);
        $source = str_replace(' />', '/>', $source);

        // fix for script self enclosing tag (php DOMParser does not know html5)
        $source = str_replace('></script>', '/>', $source);

        $html = preg_replace('|' . $search . '|ms', "\n".$replacement."\n", $source);

        if ($query == "//w-layout[@template='layouts/2col.htpl']") {
            //die($html);
        }

        return $html;

    }
}