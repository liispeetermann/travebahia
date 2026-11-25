#!/usr/bin/perl
# Tiny local preview server (perl is built into macOS): perl tools/serve.pl [port]
use strict; use warnings; use IO::Socket::INET;
my $port = shift || 8080; my $root = shift || '.';
my %types = (html=>'text/html; charset=utf-8', css=>'text/css', js=>'application/javascript', svg=>'image/svg+xml', xml=>'application/xml', txt=>'text/plain; charset=utf-8', webmanifest=>'application/manifest+json', jpg=>'image/jpeg', jpeg=>'image/jpeg', png=>'image/png', webp=>'image/webp', avif=>'image/avif');
my $srv = IO::Socket::INET->new(LocalPort=>$port, Listen=>20, ReuseAddr=>1, Proto=>'tcp') or die "port $port: $!";
print "Serving $root at http://localhost:$port\n";
while (my $c = $srv->accept) {
  my $req = <$c> // ''; while (my $l = <$c>) { last if $l =~ /^\r?\n$/ }
  my ($path) = $req =~ m{^GET\s+([^\s?#]+)}; $path //= '/'; $path =~ s/%([0-9A-Fa-f]{2})/chr(hex($1))/ge; $path =~ s/\.\.//g;
  my $f = "$root$path"; $f .= 'index.html' if $f =~ m{/$}; if ($f !~ m{/$} && -f "$f.html") { $f .= '.html' } elsif (-d $f) { $f .= '/index.html' }
  my $code = '200 OK'; unless (-f $f) { $f = "$root/404.html"; $code = '404 Not Found' }
  my ($ext) = $f =~ /\.(\w+)$/; my $type = $types{lc($ext // '')} // 'application/octet-stream';
  open(my $fh, '<:raw', $f); local $/; my $body = <$fh> // ''; close $fh;
  print $c "HTTP/1.1 $code\r\nContent-Type: $type\r\nContent-Length: ".length($body)."\r\nCache-Control: no-cache\r\nConnection: close\r\n\r\n$body"; close $c;
}
